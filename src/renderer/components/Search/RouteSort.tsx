export default function RouteSort({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (change: "Favorites" | "Views" | null) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-2 items-center">
      <span>Sort by</span>
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-1 sm:justify-between">
          <input
            type="radio"
            className="radio"
            checked={value === null}
            onChange={(e) => {
              if (!e.currentTarget.checked) return;
              onChange(null);
            }}
          />
          <span className="label-text">Latest</span>
        </label>
      </div>
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-1 sm:justify-between">
          <input
            type="radio"
            className="radio"
            checked={value === "Favorites"}
            onChange={(e) => {
              if (!e.currentTarget.checked) return;
              onChange("Favorites");
            }}
          />
          <span className="label-text">Favorites</span>
        </label>
      </div>
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-1 sm:justify-between">
          <input
            type="radio"
            className="radio"
            checked={value === "Views"}
            onChange={(e) => {
              if (!e.currentTarget.checked) return;
              onChange("Views");
            }}
          />
          <span className="label-text">Views</span>
        </label>
      </div>
    </div>
  );
}
