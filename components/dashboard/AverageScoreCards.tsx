const AverageScoreCards = ({ scoreCard }: { scoreCard: { label: string; value: number; color?: string } }) => {
    const safeValue = Math.max(0, Math.min(100, Math.floor(scoreCard.value * 100) / 100));
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center">
            <p className="text-zinc-400 text-sm">{scoreCard.label}</p>
            <p className={`text-3xl font-bold mt-1 ${scoreCard.color}`}>{safeValue}</p>
            <p className="text-zinc-500 text-xs mt-1">/ 100</p>
        </div>
    );
};

export default AverageScoreCards;
