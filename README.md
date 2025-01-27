# R1 Automated PR Example

A basic example of how to use DeepSeek's r1 with Groq to automatically create a PR in seconds.

## Setup

1. Clone the repo
2. In the root of the repo, run `npm install`
3. Create a `.env.local` file with the following variables:

```env
GROQ_API_KEY= # Your Groq API key
GITHUB_TOKEN= # GITHUB PAT TOKEN WITH REPO SCOPE
GITHUB_OWNER= # The owner of the repository
GITHUB_REPO= # The name of the repository
```

4. Run the script:

```bash
npm run start
```

5. Watch the PR be created
6. Check GitHub to see the PR
