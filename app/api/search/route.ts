import { NextRequest, NextResponse } from "next/server";
import { searchRepositories, getReadmeContent } from "@/lib/github";
import { containsForbiddenKeywords } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const { query, username, details = [], language, limit, minStars } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Security Check: Forbidden Keywords
    const allInputText = `${query} ${username || ""} ${details.join(" ")}`;
    const forbiddenWord = containsForbiddenKeywords(allInputText);
    if (forbiddenWord) {
      return NextResponse.json(
        { error: `การค้นหาของคุณถูกระงับเนื่องจากพบคำที่ไม่เหมาะสม: "${forbiddenWord}"` }, 
        { status: 403 }
      );
    }

    // 1. Search GitHub
    const repos = await searchRepositories(query, { user: username, language, limit, minStars });

    if (repos.length === 0) {
      return NextResponse.json({ repos: [], analysis: "" });
    }

    // 2. Fetch Readmes and check details for the top results (limit to top 10 for performance)
    const extraDetails = details.filter((d: string) => d.trim() !== "");
    
    if (extraDetails.length > 0) {
      const reposWithChecks = await Promise.all(
        repos.slice(0, 10).map(async (repo) => {
          const readme = await getReadmeContent(repo.owner, repo.name);
          const combinedText = `${repo.description || ""} ${readme}`.toLowerCase();
          
          const matchResults = extraDetails.map((detail: string) => ({
            detail,
            found: combinedText.includes(detail.toLowerCase())
          }));

          return { ...repo, matchDetails: matchResults };
        })
      );

      // Replace the top results with checked ones, keep the rest as they are
      const finalRepos = [...reposWithChecks, ...repos.slice(10)];
      return NextResponse.json({ repos: finalRepos, analysis: "" });
    }

    return NextResponse.json({ repos, analysis: "" });
  } catch (error: any) {
    console.error("Search Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
