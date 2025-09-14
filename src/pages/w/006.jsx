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

const AlertOverlayBox = styled.div`
  --height: calc(var(--top-bar-height) + var(--bottom-bar-height));

  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.3rem;
  background: rgba(20, 20, 20, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: absolute;
  width: 100%;
  height: var(--height);
  bottom: ${({ $alert }) =>
    $alert ? `0` : `calc( (var(--height) * -1 ) - 10px)`};
  left: 0;
  transition: all 1s ease-in-out;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  z-index: 10;
  overflow: hidden;

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
`;

const AnimationDiv = styled.div`
  position: absolute;
  inset: 0;
  transform: scale(2);
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const TopDonorOverlay = styled.div`
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

  .label,
  .name,
  .amount {
    animation: ${fadeIn} 1s ease-in-out;
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

  .amount {
    font-size: 1.4rem;
    font-weight: 600;
    color: #ff914d;
  }

  .animation-container {
    max-width: 30%;
  }
`;

// --- WIDGET COMPONENT ---

// Constants for controlling the top donor view
const TOP_DONOR_VIEW_INTERVAL = 30000; // Show top donors every 30 seconds
const TOP_DONOR_DISPLAY_DURATION = 4000; // Show each top donor for 5 seconds
const nameCharLimit = 18;

const Widget006 = () => {
  const newDonationAudio = useCallback(() => {
    return typeof window !== "undefined"
      ? new Audio("/audio/new-donation.webm")
      : null;
  }, []);

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
  const [showAlert, setShowAlert] = useState(false);
  const [alertQueue, setAlertQueue] = useState([]);
  const [checking, setChecking] = useState(false);
  const [playAudio, setPlayAudio] = useState(true);
  const [showLogo, setShowLogo] = useState(true);

  // State for managing the top donor takeover view
  const [isTopDonorViewActive, setIsTopDonorViewActive] = useState(false);
  const [currentTopDonor, setCurrentTopDonor] = useState(null);

  const animationContainer = useRef(null);
  const winnerAnimationContainer = useRef(null);

  const checkForAlerts = useCallback(() => {
    // Don't show alerts during top donor view
    if (!alertQueue.length || checking || isTopDonorViewActive) {
      return;
    }
    setChecking(true);
    setShowAlert(true);

    if (playAudio) {
      const alertAudio = newDonationAudio();
      alertAudio.play();
    }

    const timeout = setTimeout(() => {
      setShowAlert(false);
      setChecking(false);
      setAlertQueue((prev) => prev.slice(1));
    }, 12000);
    return () => clearTimeout(timeout);
  }, [alertQueue, checking, playAudio, isTopDonorViewActive, newDonationAudio]);

  useEffect(() => {
    const alertsInterval = setInterval(checkForAlerts, 2000);
    return () => clearInterval(alertsInterval);
  }, [checkForAlerts]);

  // This effect hook manages the entire top donor takeover flow
  const topDonorTimeoutRef = useRef(null);

  // 1. DEFINE THE ACTION: Create a memoized, stable function for the entire cycle.
  //    useCallback ensures this function is not recreated on every render.
  const cycleTopDonors = useCallback(async () => {
    try {
      // Fetch the latest top donor data
      const response = await fetch(
        "https://api-v2.chessbase.in/v2/hc/widget-stats"
      );
      const result = await response.json();

      if (!result.ok || !result.data || !result.data.topDonors) {
        return; // Exit early if data is invalid
      }

      // Prepare a clean list of top donors to show, filtering out nulls
      const { topDonors } = result.data;
      const topDonorsToShow = [
        { ...topDonors.allTime, label: "All-Time Top" },
        { ...topDonors.monthly, label: "Monthly Top" },
        { ...topDonors.today, label: "Today's Top" },
      ].filter((donor) => donor && donor.name);

      if (topDonorsToShow.length === 0) {
        return; // Exit if there are no valid top donors to show
      }

      // Activate the takeover view
      setIsTopDonorViewActive(true);
      setUpdateRecentDonors(false);

      // Loop through the donors, showing each one for a set duration
      for (const donor of topDonorsToShow) {
        setCurrentTopDonor(donor);
        await new Promise((resolve) =>
          setTimeout(resolve, TOP_DONOR_DISPLAY_DURATION)
        );
      }
    } catch (error) {
      console.error("Failed to cycle top donors:", error);
    } finally {
      // Deactivate the view and resume normal operations
      setIsTopDonorViewActive(false);
      setCurrentTopDonor(null);
      setUpdateRecentDonors(true);

      // Schedule the NEXT run. This is the key to the polling loop.
      topDonorTimeoutRef.current = setTimeout(
        cycleTopDonors,
        TOP_DONOR_VIEW_INTERVAL
      );
    }
  }, []); // Empty dependency array: this function is created once and never changes.
  // All setters from useState are guaranteed to be stable.

  // 2. MANAGE THE LIFECYCLE: This useEffect's only job is to start and stop the cycle.
  useEffect(() => {
    // Start the first cycle when the component mounts.
    cycleTopDonors();

    // Return a cleanup function.
    // This will run ONLY when the component unmounts.
    return () => {
      // If the component is unmounted, we MUST clear any pending timeout.
      // This is the most critical part for preventing memory leaks.
      clearTimeout(topDonorTimeoutRef.current);
    };
  }, [cycleTopDonors]); // The effect depends on our stable callback.

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData,
    });
    return () => anim.destroy();
  }, []);

  useEffect(() => {
    const winnerAnim = lottie.loadAnimation({
      container: winnerAnimationContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: winnerAnimation,
    });
    winnerAnim.setSpeed(0.5);
    return () => winnerAnim.destroy();
  }, [isTopDonorViewActive]);

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
      if (!updateRecentDonors || isTopDonorViewActive) return;
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
  }, [updateRecentDonors, isTopDonorViewActive]);

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
      setAlertQueue((prev) => [...prev, ...newDonors]);
    }
  }, [
    recentDonors,
    previousDonors.length,
    updateRecentDonors,
    setVisibleToLatestDonor,
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
    setAlertQueue((prev) => [...prev, testDonor]);
  };

  return (
    <ParentBox>
      <WidgetContainer>
        {/* The Top Donor Overlay */}
        <TopDonorOverlay $visible={isTopDonorViewActive}>
          {currentTopDonor && (
            <>
              <div
                ref={winnerAnimationContainer}
                className="animation-container"
              ></div>
              <div>
                <p className="label">{currentTopDonor.label}</p>
                <p className="name">
                  {currentTopDonor.name.slice(0, nameCharLimit)}
                </p>
                <p className="amount">
                  ₹{numeral(currentTopDonor.amount).format("0,0")}
                </p>
              </div>
            </>
          )}
        </TopDonorOverlay>

        <AlertOverlayBox $alert={showAlert}>
          <p className="title">{alertQueue[0] ? alertQueue[0].name : ""}</p>
          <p className="amount">{`₹${
            alertQueue[0] ? alertQueue[0].amount : ""
          }`}</p>
          <p className="subtext">
            Thank you for your contribution towards growing Chess in India!
          </p>
          <AnimationDiv ref={animationContainer}></AnimationDiv>
        </AlertOverlayBox>

        {/* --- Regular Widget View --- */}
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
        <Button onClick={handleResetDonor} disabled={isTopDonorViewActive}>
          Reset
        </Button>
        <Button
          onClick={handleNextDonor}
          disabled={isTopDonorViewActive || visibleDonor.index === 0}
        >
          &#8592;
        </Button>
        <Button
          onClick={handlePrevDonor}
          disabled={
            isTopDonorViewActive ||
            visibleDonor.index >= recentDonors.length - 1
          }
        >
          &#8594;
        </Button>
        <VisibleDonorIndex>
          {recentDonors.length > 0 ? visibleDonor.index + 1 : 0}/
          {recentDonors.length}
        </VisibleDonorIndex>
        <Button
          onClick={handleTestAlert}
          $isTest={true}
          disabled={isTopDonorViewActive}
        >
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
