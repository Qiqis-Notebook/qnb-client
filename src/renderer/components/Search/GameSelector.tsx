export default function GameSelector({
  game,
  onChange,
}: {
  game: "Genshin" | "WuWa" | null;
  onChange: (change: "Genshin" | "WuWa" | null) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-2 items-center">
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-1 sm:justify-between">
          <input
            type="radio"
            className="radio"
            checked={game === null}
            onChange={(e) => {
              if (!e.currentTarget.checked) return;
              onChange(null);
            }}
          />
          <span className="label-text">All</span>
        </label>
      </div>
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-1 sm:justify-between">
          <input
            type="radio"
            className="radio"
            checked={game === "Genshin"}
            onChange={(e) => {
              if (!e.currentTarget.checked) return;
              onChange("Genshin");
            }}
          />
          <span className="label-text">Genshin</span>
        </label>
      </div>
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-1 sm:justify-between">
          <input
            type="radio"
            className="radio"
            checked={game === "WuWa"}
            onChange={(e) => {
              if (!e.currentTarget.checked) return;
              onChange("WuWa");
            }}
          />
          <span className="label-text">Wuthering Waves</span>
        </label>
      </div>
    </div>
  );
}
