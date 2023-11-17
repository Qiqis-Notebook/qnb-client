import { useEffect, useState, useId, Fragment, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Config
import { MAX_RECENT } from "@Config/limits";
import { BASE_URL } from "@Config/constants";

// Context
import { useSettings } from "@Context/SettingsContext";

// Util
import { toast } from "react-toastify";
import { recentTable } from "../db";

// Asset
import Logo from "@Assets/qiqiLogo.png";
import { ArrowLeftIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";

// Types
import { RouteDetail, RouteObject } from "@Types/Routes";

// Component
import Linkify from "linkify-react";
import Spinner from "@Components/Spinner";
import RouteAuthor from "@Components/RouteAuthor";
import AvatarList from "@Components/AvatarList";
import Favorite from "@Components/Favorite";
import Divider from "@Components/Divider";
import Timer from "@Components/Timer";
import StyledScrollbar from "@Components/StyledScrollbar";

export default function RoutePage() {
  let { rid } = useParams();
  const navigate = useNavigate();

  const { settings } = useSettings();
  const { autoStart } = settings.routeWindow;

  // Component id
  const id = useId();

  // States
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RouteDetail | null>(null);
  const [launched, setLaunched] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const launchedRef = useRef<boolean>();
  launchedRef.current = launched;

  // Functions
  const handleBack = () => {
    navigate(-1);
  };
  const handleOpen = () => {
    window.electron.ipcRenderer.openWindow(
      `${BASE_URL}/embed/route/${data._id}`
    );
    setLaunched(true);
    setStartTimer(true);
    // Add to recent
    addToRecent(data);
  };
  const handleClose = () => {
    window.electron.ipcRenderer.closeWindow();
    setLaunched(false);
    setStartTimer(false);
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
    let isMounted = true;
    const fetchData = async (apiUrl: string, requestId: string) => {
      try {
        // Send a message to the main process to fetch data
        window.electron.ipcRenderer.getData(apiUrl, requestId).then((resp) => {
          if (isMounted) {
            if (resp.data) {
              setData(resp.data.data as RouteObject);
            }
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error.message);
        toast.error(error);
        if (isMounted) {
          setLoading(false);
        }
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

    window.electron.ipcRenderer.on("window-event", (arg) => {
      if (arg === 0 && isMounted && launchedRef.current) {
        setLaunched(false);
        setStartTimer(false);
      }
    });

    return () => {
      window.electron.ipcRenderer.abortRequest(id);
      isMounted = false;
    };
  }, []);

  // Action on data
  useEffect(() => {
    if (!data) return;

    // Launch window
    if (autoStart) {
      handleOpen();
    }
  }, [data]);

  const debounce = (func: () => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;

    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(), delay);
    };
  };

  const handleRestart = debounce(() => {
    // Set StartTime to false first
    setStartTimer(false);

    // After render, call handleOpen
    setTimeout(() => {
      handleOpen();
    }, 0);
  }, 1000); // Debounce restart event (1 second)

  return (
    <div className="relative h-full">
      <div className="h-full w-full absolute z-10 p-2 flex flex-col mx-auto">
        <div className="flex justify-between items-center">
          {/* Back */}
          <button className="btn btn-ghost btn-square" onClick={handleBack}>
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          {/* Timer */}
          {data && <Timer start={startTimer} />}
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
                <StyledScrollbar>
                  <div className="h-40 whitespace-pre-line break-words leading-normal w-full">
                    {data.description ? (
                      <Linkify
                        as="pre"
                        options={{
                          defaultProtocol: "https",
                          target: "_blank",
                        }}
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
                </StyledScrollbar>
                {/* Actions */}
                <div className="flex flex-row gap-2 w-full">
                  <Favorite routeDetail={data} />
                  <button
                    className="btn grow"
                    disabled={!launched}
                    onClick={handleRestart}
                  >
                    Restart
                  </button>
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
              <div className="w-full flex grow justify-center items-center">
                Error loading route
              </div>
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
