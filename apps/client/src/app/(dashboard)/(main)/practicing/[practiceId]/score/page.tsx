import ScoreViewer from "./_components/scoreViewer";
import { getXmlData } from "./action/getXmlData";

export default async function ScorePage({
    params,
}: {
    params: { practiceId: string };
}) {
        const xmlData = await getXmlData(params.practiceId);
        if (!xmlData.ok) {
            return <div>楽譜が見つかりません</div>;
        }
        return (
        <div>
            <ScoreViewer xmlData={xmlData.value} />
        </div>
    );
}