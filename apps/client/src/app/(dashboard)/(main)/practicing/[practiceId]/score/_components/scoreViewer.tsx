"use client";
import { useEffect, useRef, useState } from "react";
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

export default function ScorePage({xmlData}: {xmlData: string}) {
    const containerRef = useRef(null); 
    const osmdRef = useRef<OpenSheetMusicDisplay | null>(null); 
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current || !xmlData) return;

    if (osmdRef.current) return; 

    const options = {
      // drawingParameters: "compact", // ← いったんコメントアウト！
      autoResize: true,
      backend: "svg",
      drawingParameters: "default", // デモサイトと同じ標準設定にする
    };

    const osmd = new OpenSheetMusicDisplay(containerRef.current, options);
    osmdRef.current = osmd; 

    try {
        osmd.load(xmlData).then(() => {
            osmd.render();
            setLoading(false);
        });
    } catch (error) {
        console.error("OSMDの読み込みまたはレンダリング中にエラーが発生しました:", error);
        setLoading(false);
    }
  }, [xmlData]);

    return (
        <div>
      {loading && xmlData && <p>楽譜を読み込み中...</p>}
      {/* 楽譜がレンダリングされるコンテナ */}
      <div ref={containerRef} style={{ width: '100%', height: 'auto' }} />
    </div>
    );
}