import { groq } from "@ai-sdk/groq";
import { Octokit } from "@octokit/rest";
import { extractReasoningMiddleware, generateText, experimental_wrapLanguageModel as wrapLanguageModel } from "ai";
import { config } from "dotenv";
import { parseStringPromise } from "xml2js";

config({ path: ".env.local" });

const GITHUB_OWNER = process.env.GITHUB_OWNER || "";
const GITHUB_REPO = process.env.GITHUB_REPO || "";

if (!GITHUB_OWNER || !GITHUB_REPO) {
  throw new Error("GITHUB_OWNER and GITHUB_REPO environment variables must be set");
}

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const enhancedModel = wrapLanguageModel({
  model: groq("deepseek-r1-distill-llama-70b"),
  middleware: extractReasoningMiddleware({ tagName: "think" })
});

interface FileContent {
  path: string;
  content: string;
}

function extractXMLFromResponse(text: string): string {
  const xmlStart = text.indexOf("<response>");
  const xmlEnd = text.indexOf("</response>") + "</response>".length;

  if (xmlStart === -1 || xmlEnd === -1) {
    throw new Error("Could not find valid XML in model response");
  }

  return text.slice(xmlStart, xmlEnd);
}

interface PRMetadata {
  title: string;
  body: string;
}

interface GeneratedContent {
  files: FileContent[];
  pr: PRMetadata;
}

async function parseModelResponse(xmlResponse: string): Promise<GeneratedContent> {
  const parsed = await parseStringPromise(xmlResponse);
  return {
    files: parsed.response.files[0].file.map((file: any) => ({
      path: file.path[0],
      content: file.content[0]
    })),
    pr: {
      title: parsed.response.pullRequest[0].title[0],
      body: parsed.response.pullRequest[0].body[0]
    }
  };
}

async function createAutomatedPR() {
  try {
    const { text: rawResponse, reasoning } = await generateText({
      model: enhancedModel,
      messages: [
        {
          role: "system",
          content: `You are a TypeScript expert. Respond ONLY with valid XML in this exact format:
<response>
  <pullRequest>
    <title>Title of the pull request</title>
    <body>Detailed description of the changes</body>
  </pullRequest>
  <files>
    <file>
      <path>server/types.ts</path>
      <content>// TypeScript code here</content>
    </file>
    <!-- Additional files -->
  </files>
</response>

Generate a complete Express server implementation with these files:
- server/types.ts
- server/config.ts
- server/middleware/auth.ts
- server/routes/webhook.ts
- server/server.ts
- server/README.md
- server/.env.example

Each file should be complete and production-ready with proper imports, error handling, and logging.`
        },
        {
          role: "user",
          content: `Create an Express server that:
1. Listens for Gmail API push notifications (webhooks)
2. Verifies incoming webhook authenticity using Google's authentication
3. Handles Gmail notification payloads
4. Includes proper TypeScript types for all webhooks and payloads
5. Uses environment variables for configuration
6. Implements proper error handling and logging
7. Includes clear documentation for setup and usage

The server should be production-ready and follow TypeScript/Node.js best practices.`
        }
      ]
    });

    console.log("Raw Response:", rawResponse);
    console.log("Reasoning:", reasoning);

    const xmlResponse = extractXMLFromResponse(rawResponse);
    console.log("Extracted XML:", xmlResponse);

    const { files, pr } = await parseModelResponse(xmlResponse);

    // Get the default branch
    const { data: repo } = await octokit.repos.get({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO
    });

    const defaultBranch = repo.default_branch;
    const newBranch = `feature/gmail-webhook-server-${Date.now()}`;

    // Get the SHA of the default branch
    const { data: ref } = await octokit.git.getRef({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      ref: `heads/${defaultBranch}`
    });

    // Create a new branch
    await octokit.git.createRef({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      ref: `refs/heads/${newBranch}`,
      sha: ref.object.sha
    });

    // Create/update all files
    for (const file of files) {
      await octokit.repos.createOrUpdateFileContents({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: file.path,
        message: `Add ${file.path}`,
        content: Buffer.from(file.content).toString("base64"),
        branch: newBranch
      });
    }

    // Create pull request
    const { data: pullRequest } = await octokit.pulls.create({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      title: pr.title,
      body: pr.body,
      head: newBranch,
      base: defaultBranch
    });

    // Add model's reasoning as a PR comment
    await octokit.issues.createComment({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      issue_number: pullRequest.number,
      body: `## AI Model's Reasoning Process\n\n${reasoning}\n\n## Generated Files\n${files.map((f) => `- ${f.path}`).join("\n")}`
    });

    console.log("Pull request created:", pullRequest.html_url);
  } catch (error) {
    console.error("Error creating PR:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
  }
}

createAutomatedPR();
