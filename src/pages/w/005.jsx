import styled from 'styled-components';
import { useState, useEffect, useRef, useCallback } from 'react';
import lottie from 'lottie-web';
import animationData from '../../../public/animation2.json';
import moment from 'moment';
import numeral from 'numeral';

const ParentBox = styled.div`
  --top-bar-height: 83px;
  --bottom-bar-height: 48px;
  --color-primary-highlight: #ff914d;;
  
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
  background-color: ${({ $syncing }) => ($syncing ? '#DAF7A6 ' : '#FAA0A0')};
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
  color:rgb(35, 34, 19);
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
  transform: ${({ $visible }) => ($visible ? 'translateY(0)' : 'translateY(-20px)')};
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
  transform: ${({ $visible }) => ($visible ? 'translateY(0)' : 'translateY(20px)')};
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
  background-color: ${({ $isTest }) => ($isTest ? '#dc2626' : '#212121')};
  color: ${({ $isTest }) => ($isTest ? '#ffffff' : '#ebc49f')};
  cursor: pointer;

  &:hover {
    background-color: ${({ $isTest }) => ($isTest ? '#ef4444' : '#ebc49f')};
    color: ${({ $isTest }) => ($isTest ? '#ffffff' : '#212121')};
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
  bottom: ${({ $alert }) => ($alert ? `0` : `calc( (var(--height) * -1 ) - 10px)`)};
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
    text-shadow:  2px 4px rgba(0, 0, 0, 0.5);
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

const nameCharLimit = 18;

const Widget002 = () => {
  const newDonationAudio = useCallback(() => {
    return typeof window !== 'undefined'
      ? new Audio('/audio/new-donation.webm')
      : null;
  }, []);

  const [counts, setCounts] = useState({ believers: 0, bigBelievers: 0 });
  const [recentDonors, setRecentDonors] = useState([]);
  const [previousDonors, setPreviousDonors] = useState([]);
  const [visibleDonor, setVisibleDonor] = useState({
    name: 'loading...',
    amount: 0,
    index: 0,
    date: '',
  });
  const [updateRecentDonors, setUpdateRecentDonors] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertQueue, setAlertQueue] = useState([]);
  const [checking, setChecking] = useState(false);
  const [playAudio, setPlayAudio] = useState(true);
  const [showLogo, setShowLogo] = useState(true);

  const animationContainer = useRef(null);

  const checkForAlerts = useCallback(() => {
    if (!alertQueue.length || checking) {
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
      setChecking(false); // Ensure next check can occur
      setAlertQueue((prev) => prev.slice(1));
    }, 12000);
    return () => clearTimeout(timeout);
  }, [alertQueue, checking, setAlertQueue, setShowAlert, playAudio]);

  useEffect(() => {
    const alertsInterval = setInterval(checkForAlerts, 2000);

    return () => {
      clearInterval(alertsInterval);
      // Clear any pending timeout when the component unmounts
      clearTimeout(checkForAlerts());
    };
  }, [checkForAlerts]);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData,
    });

    return () => {
      anim.destroy();
    };
  }, []);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setShowLogo(prev => !prev);
    }, 15000);

    return () => {
      clearInterval(animationInterval);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api-v2.chessbase.in/v1/hc/widget-stats'
        );
        const data = await response.json();
        const { believersCount, bigBelieversCount } = data.data;
        setCounts({
          believers: believersCount,
          bigBelievers: bigBelieversCount,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [alertQueue]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api-v2.chessbase.in/v1/hc/donors'
        );
        const data = await response.json();
        if (
          updateRecentDonors &&
          data.ok &&
          data.data &&
          data.data.recentDonors
        ) {
          setRecentDonors(data.data.recentDonors);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data initially
    fetchData();

    // Polling interval (every 5 seconds in this example)
    const fetchDataInterval = setInterval(fetchData, 5000);

    // Clear intervals on component unmount
    return () => {
      clearInterval(fetchDataInterval);
    };
  }, []);

  const checkForNewDonors = (newDonors) => {
    // make sure we don't show alerts on first render
    if (previousDonors.length === 0) {
      return;
    }
    const newAlertQueue = [...alertQueue, ...newDonors];
    setAlertQueue(newAlertQueue);
  };

  useEffect(() => {
    // Compare with the previous donors to identify new ones
    const newDonors = recentDonors.filter(
      (donor) => !previousDonors.find((prevDonor) => prevDonor.id === donor.id)
    );

    // Update the previous donors
    setPreviousDonors(recentDonors);

    // Update Visible Donor
    if (updateRecentDonors) {
      setVisibleToLatestDonor();
    }

    // Do something with new donors
    if (newDonors.length > 0) {
      checkForNewDonors(newDonors);
    }
  }, [recentDonors]);

  const setVisibleToLatestDonor = () => {
    setUpdateRecentDonors(true);
    let newVisibleDonor = recentDonors[0];
    if (!newVisibleDonor) {
      newVisibleDonor = {
        name: 'loading...',
        amount: 'loading...',
        date: '',
      };
    }
    newVisibleDonor.index = 0;
    setVisibleDonor(newVisibleDonor);
  };

  const handlePrevDonor = () => {
    setVisibleDonor((currDonor) => {
      if (currDonor.index + 1 === recentDonors.length) {
        return;
      }
      setUpdateRecentDonors(false);
      const newVisibleDonor = recentDonors[currDonor.index + 1];
      newVisibleDonor.index = currDonor.index + 1;
      return newVisibleDonor;
    });
  };

  const handleNextDonor = () => {
    setVisibleDonor((currDonor) => {
      if (currDonor.index - 1 === 0) {
        setUpdateRecentDonors(true);
        const newVisibleDonor = recentDonors[0];
        newVisibleDonor.index = 0;
        return newVisibleDonor;
      }
      setUpdateRecentDonors(false);
      const newVisibleDonor = recentDonors[currDonor.index - 1];
      newVisibleDonor.index = currDonor.index - 1;
      return newVisibleDonor;
    });
  };

  const handleResetDonor = () => {
    setVisibleDonor(() => {
      setUpdateRecentDonors(true);
      const newVisibleDonor = recentDonors[0];
      newVisibleDonor.index = 0;
      return newVisibleDonor;
    });
  };

  const handleTestAlert = () => {
    const testDonor = {
      name: 'Test Donor',
      amount: 1000,
      id: 'test-' + Date.now()
    };
    setAlertQueue(prev => [...prev, testDonor]);
  };

  return (
    <ParentBox>
      <WidgetContainer>
        <AlertOverlayBox $alert={showAlert}>
          <p className="title">{alertQueue[0] ? alertQueue[0].name : ''}</p>
          <p className="amount">{`₹${
            alertQueue[0] ? alertQueue[0].amount : ''
          }`}</p>
          <p className="subtext">
            Thank you for your contribution towards growing Chess in India!
          </p>
          <AnimationDiv ref={animationContainer}></AnimationDiv>
        </AlertOverlayBox>

        <TopBar>
        <StatsBox>
            <div className="stat-box-child">
              <StatNumbers>{counts.believers}</StatNumbers>
              <p>Believers</p>
            </div>
    
          </StatsBox>
          <div style={{ position: 'relative', width: '40%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <WebsiteLogo src="/helpchess-logo-new.svg" alt="HelpChess Logo" $visible={showLogo} />
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
                ? visibleDonor.name.slice(0, nameCharLimit) + '...'
                : visibleDonor.name
            } - ₹${numeral(visibleDonor.amount).format('0,0')}`}
            <span className="time">
              <em>{moment(visibleDonor.date).fromNow() || 'loading...'}</em>
            </span>
          </p>
        </BottomBar>
      </WidgetContainer>

      <ButtonBox>
        <Button onClick={handleResetDonor}>Reset</Button>
        <Button onClick={handleNextDonor} disabled={visibleDonor.index === 0}>
          &#8592;
        </Button>
        <Button
          onClick={handlePrevDonor}
          disabled={visibleDonor.index === recentDonors.length - 1}
        >
          &#8594;
        </Button>
        <VisibleDonorIndex>
          {visibleDonor.index + 1}/{recentDonors.length}
        </VisibleDonorIndex>
        <Button onClick={handleTestAlert} $isTest={true}>Test Alert</Button>
        <Button onClick={() => setPlayAudio((curr) => !curr)}>
          {playAudio ? 'Disable Audio' : 'Enable Audio'}
        </Button>
      </ButtonBox>
      <SyncStatus $syncing={updateRecentDonors}>
        {updateRecentDonors ? (
          <span>&#10003; Actively Syncing Donors</span>
        ) : (
          <span>&#10005; Not Syncing - Click reset to enable sync</span>
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

export default Widget002;
