import styled, { keyframes } from "styled-components";
import { useState, useEffect, useRef, useCallback } from "react";
import lottie from "lottie-web";
import animationData from "../../../public/animation2.json";
import winnerAnimation from "../../../public/winnerAnimation.json";
import moment from "moment";
import numeral from "numeral";

const ParentBox = styled.div`
  --top-bar-height: 83px;
  --bottom-bar-height: 48px;
  --color-primary-highlight: #ff914d;

  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5rem;
  align-items: center;
  background-color: #00b140;
`;

const WidgetContainer = styled.div`
  width: 470px;
  height: calc(var(--top-bar-height) + var(--bottom-bar-height));
  background-color: #212121;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const WarningText = styled.p`
  background-color: #fffaa0;
  color: #212121;
  padding: 0.5rem;
  border-radius: 10px;
  text-align: center;
`;

const SyncStatus = styled.p`
  background-color: ${({ $syncing }) => ($syncing ? "#DAF7A6 " : "#FAA0A0")};
  color: #212121;
  padding: 0.5rem;
  border-radius: 10px;
  text-align: center;
`;

const VisibleDonorIndex = styled.p`
  padding: 0.5rem;
  border-radius: 10px;
  background-color: #7bd3ea;
  color: #212121;
  cursor: pointer;
  font-weight: bold;
  letter-spacing: 1.1px;
`;

const TopBar = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  gap: 0.5rem;
`;

const BottomBar = styled.div`
  width: 100%;
  height: var(--bottom-bar-height);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(to right, #ffde59, #ff914d);
  font-size: 1.3em;
  font-weight: bold;
  letter-spacing: 0;
  color: rgb(35, 34, 19);
  text-align: center;
  text-transform: uppercase;

  .time {
    font-size: 1rem;
    font-weight: 600;
    margin-left: 0.7rem;
    text-transform: lowercase;
    color: rgb(59, 59, 59);
  }
`;

const StatsBox = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #0cc0df;
  gap: 2rem;
  font-size: 1rem;
  letter-spacing: 0;

  .stat-box-child {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
  }
`;

const WebsiteLogo = styled.img`
  min-width: 40%;
  margin-left: -4px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) =>
    $visible ? "translateY(0)" : "translateY(-20px)"};
  transition: all 0.8s ease-in-out;
`;

const WebsiteText = styled.div`
  width: 100%;
  height: 100%;
  font-size: 1.6rem;
  margin-left: -4px;
  font-weight: bold;
  color: rgb(241, 244, 245);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: all 0.8s ease-in-out;
  position: absolute;
  top: 0;
  left: 0;
  transform: ${({ $visible }) =>
    $visible ? "translateY(0)" : "translateY(20px)"};
`;

const StatNumbers = styled.p`
  font-weight: bold;
  font-size: 1.6rem;
  letter-spacing: 0.7px;
  color: var(--color-primary-highlight);
`;

const Button = styled.button`
  padding: 0.5rem;
  border-radius: 10px;
  background-color: ${({ $isTest }) => ($isTest ? "#dc2626" : "#212121")};
  color: ${({ $isTest }) => ($isTest ? "#ffffff" : "#ebc49f")};
  cursor: pointer;

  &:hover {
    background-color: ${({ $isTest }) => ($isTest ? "#ef4444" : "#ebc49f")};
    color: ${({ $isTest }) => ($isTest ? "#ffffff" : "#212121")};
  }

  &:disabled {
    background-color: gray;
    cursor: not-allowed;
  }
`;

const ButtonBox = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const NotificationOverlay = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.3rem;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
  transition: opacity 0.8s ease-in-out;
  z-index: 20;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};

  .title,
  .amount,
  .subtext,
  .label,
  > div {
    animation: ${fadeIn} 1s ease-in-out;
  }

  .title {
    font-size: 1.4rem;
    font-weight: bold;
    letter-spacing: 1.5px;
    color: var(--color-primary-highlight);
    text-transform: uppercase;
    text-shadow: 2px 4px rgba(0, 0, 0, 0.5);
  }

  .amount {
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: 1.5px;
    color: var(--color-primary-highlight);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  .subtext {
    color: #ffffff;
    font-size: 1rem;
    font-weight: 400;
    letter-spacing: 1.2px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  .label {
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 1.5px;
    color: #ffffff;
    text-transform: uppercase;
  }

  .name {
    font-size: 1.8rem;
    font-weight: 800;
    letter-spacing: 1.5px;
    color: #ffde59;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  .new-donor-content {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .animation-container {
    position: absolute;
    inset: 0;
    transform: scale(2);
    z-index: -1;
  }

  .winner-animation-container {
    max-width: 30%;
  }
`;

// --- CUSTOM HOOK for managing notification queue (Corrected Logic) ---
const useNotificationQueue = (playAudio) => {
  const [notificationQueue, setNotificationQueue] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  const newDonationAudio = useCallback(
    () =>
      typeof window !== "undefined"
        ? new Audio("/audio/new-donation.webm")
        : null,
    []
  );

  // Effect 1: The Queue Processor.
  // This effect's job is to pull the next notification from the queue when ready.
  useEffect(() => {
    if (!currentNotification && notificationQueue.length > 0) {
      const nextNotification = notificationQueue[0];
      setCurrentNotification(nextNotification);

      if (playAudio && nextNotification.type === "newDonor") {
        const audio = newDonationAudio();
        audio.play();
      }
    }
  }, [notificationQueue, currentNotification, playAudio, newDonationAudio]);

  // Effect 2: The Display Timer.
  // This effect's job is to clear the notification after its duration has passed.
  useEffect(() => {
    if (currentNotification) {
      const timeout = setTimeout(() => {
        setCurrentNotification(null); // Hide the notification
        setNotificationQueue((prev) => prev.slice(1)); // Remove it from the queue
      }, currentNotification.duration);

      return () => clearTimeout(timeout);
    }
  }, [currentNotification]);

  const addNotification = useCallback((notification) => {
    setNotificationQueue((prev) => [...prev, notification]);
  }, []);

  const addNotifications = useCallback((notifications) => {
    setNotificationQueue((prev) => [...prev, ...notifications]);
  }, []);

  return { currentNotification, addNotification, addNotifications };
};

const TOP_DONOR_VIEW_INTERVAL = 60000;
const TOP_DONOR_DISPLAY_DURATION = 4000;
const NEW_DONOR_DISPLAY_DURATION = 10000;
const nameCharLimit = 18;

const Widget006 = () => {
  const [counts, setCounts] = useState({ believers: 0, bigBelievers: 0 });
  const [recentDonors, setRecentDonors] = useState([]);
  const [previousDonors, setPreviousDonors] = useState([]);
  const [visibleDonor, setVisibleDonor] = useState({
    name: "loading...",
    amount: 0,
    index: 0,
    date: "",
  });
  const [updateRecentDonors, setUpdateRecentDonors] = useState(true);
  const [playAudio, setPlayAudio] = useState(true);
  const [showLogo, setShowLogo] = useState(true);

  const { currentNotification, addNotification, addNotifications } =
    useNotificationQueue(playAudio);

  const newDonorAnimationContainer = useRef(null);
  const topDonorAnimationContainer = useRef(null);

  useEffect(() => {
    if (
      currentNotification?.type === "newDonor" &&
      newDonorAnimationContainer.current
    ) {
      const anim = lottie.loadAnimation({
        container: newDonorAnimationContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData,
      });
      return () => anim.destroy();
    }
  }, [currentNotification]);

  useEffect(() => {
    if (
      currentNotification?.type === "topDonor" &&
      topDonorAnimationContainer.current
    ) {
      const winnerAnim = lottie.loadAnimation({
        container: topDonorAnimationContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: winnerAnimation,
      });
      winnerAnim.setSpeed(0.5);
      return () => winnerAnim.destroy();
    }
  }, [currentNotification]);

  const fetchAndQueueTopDonors = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api-v2.chessbase.in/v2/hc/widget-stats"
      );
      const result = await response.json();
      if (!result.ok || !result.data?.topDonors) return;

      const { topDonors } = result.data;
      const topDonorsToShow = [
        { ...topDonors.today, label: "Today's Top" },
        { ...topDonors.weekly, label: "Weekly Top" },
        { ...topDonors.monthly, label: "Monthly Top" },
      ]
        .filter((donor) => donor && donor.name)
        .map((donor) => ({
          type: "topDonor",
          duration: TOP_DONOR_DISPLAY_DURATION,
          data: donor,
        }));

      if (topDonorsToShow.length > 0) {
        addNotifications(topDonorsToShow);
      }
    } catch (error) {
      console.error("Failed to fetch and queue top donors:", error);
    }
  }, [addNotifications]);

  useEffect(() => {
    const timeoutRef = { current: null };

    const scheduleNextTopDonorFetch = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        fetchAndQueueTopDonors();
        scheduleNextTopDonorFetch();
      }, TOP_DONOR_VIEW_INTERVAL);
    };

    scheduleNextTopDonorFetch();

    return () => clearTimeout(timeoutRef.current);
  }, [fetchAndQueueTopDonors]);

  useEffect(() => {
    const animationInterval = setInterval(
      () => setShowLogo((prev) => !prev),
      15000
    );
    return () => clearInterval(animationInterval);
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(
          "https://api-v2.chessbase.in/v2/hc/widget-stats"
        );
        const data = await response.json();
        const { believersCount, bigBelieversCount } = data.data;
        setCounts({
          believers: believersCount,
          bigBelievers: bigBelieversCount,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchRecentDonors = async () => {
      if (!updateRecentDonors || currentNotification) return;
      try {
        const response = await fetch(
          "https://api-v2.chessbase.in/v1/hc/donors"
        );
        const data = await response.json();
        if (data.ok && data.data?.recentDonors) {
          setRecentDonors(data.data.recentDonors);
        }
      } catch (error) {
        console.error("Error fetching recent donors:", error);
      }
    };
    fetchRecentDonors();
    const interval = setInterval(fetchRecentDonors, 5000);
    return () => clearInterval(interval);
  }, [updateRecentDonors, currentNotification]);

  const setVisibleToLatestDonor = useCallback(() => {
    setUpdateRecentDonors(true);
    let newVisibleDonor = recentDonors[0];
    if (!newVisibleDonor) {
      newVisibleDonor = { name: "loading...", amount: 0, date: "", index: 0 };
    } else {
      newVisibleDonor.index = 0;
    }
    setVisibleDonor(newVisibleDonor);
  }, [recentDonors]);

  useEffect(() => {
    const newDonors = recentDonors.filter(
      (donor) => !previousDonors.find((prev) => prev.id === donor.id)
    );
    setPreviousDonors(recentDonors);

    if (updateRecentDonors) {
      setVisibleToLatestDonor();
    }

    if (newDonors.length > 0 && previousDonors.length > 0) {
      const newDonorNotifications = newDonors.map((donor) => ({
        type: "newDonor",
        duration: NEW_DONOR_DISPLAY_DURATION,
        data: donor,
      }));
      addNotifications(newDonorNotifications);
    }
  }, [
    recentDonors,
    previousDonors,
    updateRecentDonors,
    setVisibleToLatestDonor,
    addNotifications,
  ]);

  const handlePrevDonor = () => {
    setUpdateRecentDonors(false);
    setVisibleDonor((curr) => {
      const newIndex = curr.index + 1;
      if (newIndex >= recentDonors.length) return curr;
      return { ...recentDonors[newIndex], index: newIndex };
    });
  };

  const handleNextDonor = () => {
    setUpdateRecentDonors(false);
    setVisibleDonor((curr) => {
      const newIndex = curr.index - 1;
      if (newIndex < 0) return curr;
      if (newIndex === 0) setUpdateRecentDonors(true);
      return { ...recentDonors[newIndex], index: newIndex };
    });
  };

  const handleResetDonor = () => {
    setUpdateRecentDonors(true);
    setVisibleToLatestDonor();
  };

  const handleTestAlert = () => {
    const testDonor = {
      name: "Test Donor",
      amount: 1000,
      id: "test-" + Date.now(),
    };
    addNotification({
      type: "newDonor",
      duration: NEW_DONOR_DISPLAY_DURATION,
      data: testDonor,
    });
  };

  const isUIBlocked = !!currentNotification;

  return (
    <ParentBox>
      <WidgetContainer>
        <NotificationOverlay $visible={isUIBlocked}>
          {currentNotification?.type === "newDonor" && (
            <div className="new-donor-content">
              <p className="title">{currentNotification.data.name}</p>
              <p className="amount">
                ₹{numeral(currentNotification.data.amount).format("0,0")}
              </p>
              <p className="subtext">
                Thank you for your contribution towards growing Chess in India!
              </p>
              <div
                ref={newDonorAnimationContainer}
                className="animation-container"
              ></div>
            </div>
          )}
          {currentNotification?.type === "topDonor" && (
            <>
              <div
                ref={topDonorAnimationContainer}
                className="winner-animation-container"
              ></div>
              <div>
                <p className="label">{currentNotification.data.label}</p>
                <p className="name">
                  {currentNotification.data.name.slice(0, nameCharLimit)}
                </p>
                <p className="amount">
                  ₹{numeral(currentNotification.data.amount).format("0,0")}
                </p>
              </div>
            </>
          )}
        </NotificationOverlay>

        <TopBar>
          <StatsBox>
            <div className="stat-box-child">
              <StatNumbers>{counts.believers}</StatNumbers>
              <p>Believers</p>
            </div>
          </StatsBox>
          <div
            style={{
              position: "relative",
              width: "40%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WebsiteLogo
              src="/helpchess-logo-new.svg"
              alt="HelpChess Logo"
              $visible={showLogo}
            />
            <WebsiteText $visible={!showLogo}>HelpChess.org</WebsiteText>
          </div>
          <StatsBox>
            <div className="stat-box-child">
              <StatNumbers>{counts.bigBelievers}</StatNumbers>
              <p>Big Believers</p>
            </div>
          </StatsBox>
        </TopBar>
        <BottomBar>
          <p>
            {`${
              visibleDonor.name.length > nameCharLimit
                ? visibleDonor.name.slice(0, nameCharLimit) + "..."
                : visibleDonor.name
            } - ₹${numeral(visibleDonor.amount).format("0,0")}`}
            <span className="time">
              <em>
                {visibleDonor.date
                  ? moment(visibleDonor.date).fromNow()
                  : "loading..."}
              </em>
            </span>
          </p>
        </BottomBar>
      </WidgetContainer>

      <ButtonBox>
        <Button onClick={handleResetDonor} disabled={isUIBlocked}>
          Reset
        </Button>
        <Button
          onClick={handleNextDonor}
          disabled={isUIBlocked || visibleDonor.index === 0}
        >
          &#8592;
        </Button>
        <Button
          onClick={handlePrevDonor}
          disabled={
            isUIBlocked || visibleDonor.index >= recentDonors.length - 1
          }
        >
          &#8594;
        </Button>
        <VisibleDonorIndex>
          {recentDonors.length > 0 ? visibleDonor.index + 1 : 0}/
          {recentDonors.length}
        </VisibleDonorIndex>
        <Button onClick={handleTestAlert} $isTest={true} disabled={isUIBlocked}>
          Test Alert
        </Button>
        <Button onClick={() => setPlayAudio((curr) => !curr)}>
          {playAudio ? "Disable Audio" : "Enable Audio"}
        </Button>
      </ButtonBox>
      <SyncStatus $syncing={updateRecentDonors}>
        {updateRecentDonors ? (
          <span> Actively Syncing Donors</span>
        ) : (
          <span> Syncing Paused</span>
        )}
      </SyncStatus>
      <WarningText>
        <strong>
          Make sure to <em>RESET</em> after clicking any button.
        </strong>
        <br />
        Note: No new recent donors will be fetched if we are not at the latest
        donor. This is intentional.
      </WarningText>
    </ParentBox>
  );
};

export default Widget006;
