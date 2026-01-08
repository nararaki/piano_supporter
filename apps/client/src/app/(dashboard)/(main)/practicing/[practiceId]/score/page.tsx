import ScoreViewer from "./_components/scoreViewer";
import { getXmlData } from "./action/getXmlData";

export default async function ScorePage({
    params,
}: {
    params: Promise<{ practiceId: string }>;
}) {
        const { practiceId } = await params;
        console.log("params", { practiceId });
        const xmlData = await getXmlData(practiceId);
        if (!xmlData.ok) {
            return <div>楽譜が見つかりません</div>;
        }
        return (
        <div>
            <ScoreViewer xmlData={xmlData.value} />
        </div>
    );
}