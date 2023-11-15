import { useEffect, useState, useId, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Config
import { MAX_RECENT } from "@Config/limits";

// Util
import { toast } from "react-toastify";
import { recentTable } from "../db";

// Asset
import Logo from "@Assets/qiqiLogo.png";
import { ArrowLeftIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";

// Types
import { RouteDetail, RouteResponse } from "@Types/Routes";

// Component
import Linkify from "linkify-react";
import Spinner from "@Components/Spinner";
import RouteAuthor from "@Components/RouteAuthor";
import AvatarList from "@Components/AvatarList";
import Favorite from "@Components/Favorite";
import Divider from "@Components/Divider";

export default function RoutePage() {
  let { rid } = useParams();
  const navigate = useNavigate();

  // Component id
  const id = useId();

  // States
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RouteDetail | null>(null);
  const [launched, setLaunched] = useState(false);

  // Functions
  const handleBack = () => {
    navigate(-1);
  };
  const handleOpen = () => {
    // TODO: Open route
    setLaunched(true);
  };
  const handleClose = () => {
    // TODO: Close route
    setLaunched(false);
  };
  const addToRecent = async (routeDetail: RouteDetail) => {
    try {
      // Add the document to the "recent" table
      await recentTable.put({
        ...routeDetail,
        added: new Date(),
      });
    } catch (error) {
      console.error("Error adding document:", error);
    }

    // Ensure that the table does not have more than the limit
    const documentCount = await recentTable.count();
    if (documentCount > MAX_RECENT) {
      // Retrieve the oldest document
      const oldestDocument = await recentTable
        .orderBy("added")
        .limit(1)
        .first();

      // Remove the oldest document
      if (oldestDocument) {
        await recentTable.delete(oldestDocument._id);
      }
    }
  };

  // Check route exist
  useEffect(() => {
    const fetchData = async (apiUrl: string, requestId: string) => {
      try {
        // Send a message to the main process to fetch data
        window.electron.ipcRenderer.getData(apiUrl, requestId);

        // Listen for the response from the main process
        window.electron.ipcRenderer.dataResponse(
          (arg: {
            requestId: string;
            data?: RouteResponse;
            error?: string;
          }) => {
            if (arg.data) {
              setData(arg.data.data);
            }
            setLoading(false);
          }
        );
      } catch (error) {
        console.error("Error fetching data:", error.message);
        toast.error(error);
        setLoading(false);
      }
    };

    // Check route id
    if (!rid) {
      toast.error("Missing route ID");
      navigate(-1);
    } else if (!/^[0-9a-fA-F]{24}$/.test(rid)) {
      toast.error("Invalid route ID");
      navigate(-1);
    } else {
      fetchData(`/gateway/route?id=${rid}`, id);
    }

    return () => {
      window.electron.ipcRenderer.abortRequest(id);
    };
  }, []);

  // Action on data
  useEffect(() => {
    if (!data) return;

    // Add to recent
    addToRecent(data);

    // Launch window
    handleOpen();
  }, [data]);

  return (
    <div className="relative h-full">
      <div className="h-full w-full absolute z-10 p-2 flex flex-col mx-auto">
        {/* Back */}
        <div>
          <button className="btn btn-ghost btn-square" onClick={handleBack}>
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
        </div>
        {loading ? (
          <div className="w-full grow justify-center items-center flex">
            <Spinner />
          </div>
        ) : (
          <Fragment>
            {data ? (
              <div className="grow flex flex-col space-y-2 w-[32rem] mx-auto justify-center">
                {/* Author + Data */}
                <div className="justify-center flex w-full">
                  <RouteAuthor route={data} />
                </div>
                {/* Value icons */}
                <div className="justify-center flex w-full">
                  <AvatarList values={data.values} />
                </div>
                {/* Title */}
                <div className="flex flex-row gap-1 w-full justify-center items-center">
                  {/* Title */}
                  {data.verified && (
                    <CheckBadgeIcon
                      className="h-8 w-8 text-green-400"
                      title="Verified"
                    />
                  )}
                  <div className="truncate text-2xl" title={data.title}>
                    {data.title}
                  </div>
                </div>
                <Divider />
                {/* Description */}
                <div className="h-40 overflow-y-auto whitespace-pre-line break-words leading-normal w-full">
                  {data.description ? (
                    <Linkify
                      as="pre"
                      options={{ defaultProtocol: "https", target: "_blank" }}
                      style={{
                        fontFamily: "inherit",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "break-word",
                      }}
                    >
                      {data.description}
                    </Linkify>
                  ) : (
                    "No description"
                  )}
                </div>
                {/* Actions */}
                <div className="flex gap-2 w-full">
                  <Favorite routeDetail={data} />
                  <button
                    className={`btn grow ${
                      launched ? "btn-error" : "btn-success"
                    }`}
                    onClick={() => (launched ? handleClose() : handleOpen())}
                  >
                    {launched ? "Close" : "Open"}
                  </button>
                </div>
              </div>
            ) : (
              <div>Error loading route</div>
            )}
          </Fragment>
        )}
      </div>
      {/* Backdrop */}
      <div className="absolute w-full flex justify-center items-center h-full z-0">
        <img src={Logo} alt="Logo" className="opacity-5" />
      </div>
    </div>
  );
}
