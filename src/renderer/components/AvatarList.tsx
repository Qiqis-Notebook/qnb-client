import { Fragment } from "react";

// Constants
import { BASE_URL } from "@Config/constants";

const ignoreList = ["i_23", "i_24", "i_103", "i_105", "i_300"];
const groupLimit = 10;
export default function AvatarList({ values = [] }: { values?: string[] }) {
  const renderList = values.filter((item) => !ignoreList.includes(item));
  function renderAvatar(values: string[], limit: number) {
    return values
      .slice(0, limit)
      .map((item, idx) => (
        <img
          className="h-10 w-10 rounded-full border-2 border-white bg-black"
          src={`${BASE_URL}/resources/images/${item}.png`}
          alt={`${item}-icon`}
          width={32}
          height={32}
          key={`icon-${idx}`}
        />
      ));
  }

  return (
    <div className="flex -space-x-4">
      {renderList.length <= groupLimit ? (
        <Fragment>{renderAvatar(renderList, groupLimit)}</Fragment>
      ) : (
        <Fragment>
          {renderAvatar(renderList, groupLimit - 1)}
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black text-xs font-medium text-white">
            +{renderList.length - (groupLimit - 1)}
          </span>
        </Fragment>
      )}
    </div>
  );
}
