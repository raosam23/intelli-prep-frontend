const OverallStatCard = ({ label, value }: { label: string; value: string | number }) => {
    const roundOffValue = typeof value === "number" ? Math.floor(value * 100) / 100 : value;
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 text-center">
            <p className="text-zinc-400 text-sm">{label}</p>
            <p className="text-white text-3xl font-bold mt-1">{roundOffValue}</p>
        </div>
    );
};

export default OverallStatCard;
