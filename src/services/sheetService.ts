import type { ApiQuestion, Topic } from "../types/sheet";

const SHEET_URL =
    "https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet";

export async function fetchSheetData(): Promise<Topic[]> {
    const res = await fetch(SHEET_URL);
    if (!res.ok) {
        throw new Error("Failed to fetch sheet data");
    }

    const json = await res.json();

    const questions: ApiQuestion[] = json.data.questions;
    const topicOrder: string[] = json.data.sheet.config.topicOrder;

    const topicMap = new Map<string, Topic>();

    for (const topicName of topicOrder) {
        topicMap.set(topicName, {
            id: topicName,
            title: topicName,
            questions: [],
        });
    }

    for (const q of questions) {
        const topic = topicMap.get(q.topic);
        if (!topic) continue;

        topic.questions.push({
            id: q._id,
            title: q.title,
            difficulty: q.questionId.difficulty,
            problemUrl: q.questionId.problemUrl,
            isSolved: q.isSolved,
            platform: q.questionId.platform,
        });
    }

    return Array.from(topicMap.values());
}