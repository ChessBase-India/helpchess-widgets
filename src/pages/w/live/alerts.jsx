import styled from 'styled-components';
import { useState, useEffect, useRef, useCallback } from 'react';
import lottie from 'lottie-web';
import animationData from '../../../../public/animation2.json';
import numeral from 'numeral';

const ParentBox = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5rem;
  align-items: center;
  background-color: black;
`;

const WidgetContainer = styled.div`
  width: 462px;
  height: 120px;
  background-color: #00b140;
  position: relative;
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

const Button = styled.button`
  padding: 0.5rem;
  border-radius: 10px;
  background-color: #212121;
  color: #ebc49f;
  cursor: pointer;

  &:hover {
    background-color: #ebc49f;
    color: #212121;
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
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.3rem;
  background-color: #95bdff;
  position: absolute;
  width: 100%;
  height: ${({ $alert }) => ($alert ? `120px` : `0`)};
  bottom: ${({ $alert }) => ($alert ? `0` : `-116px`)};
  left: 0;
  transition: all 1s ease-in-out;
  opacity: ${({ $alert }) => ($alert ? `1` : `0`)};

  .title {
    font-size: 1.1rem;
    font-weight: bold;
    letter-spacing: 1.5px;
    color: #212121;
    text-transform: uppercase;
  }

  .amount {
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: 1.5px;
    color: #212121;
  }

  .subtext {
    color: #212121;
    font-size: 0.8rem;
    font-weight: 400;
    letter-spacing: 1.2px;
  }
`;

const AnimationDiv = styled.div`
  position: absolute;
  inset: 0;
`;

const Alerts = () => {
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
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api-v2.chessbase.in/v1/hc/donors"
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

  return (
    <ParentBox>
      <WidgetContainer>
        <AlertOverlayBox $alert={showAlert}>
          <p className="title">{alertQueue[0] ? alertQueue[0].name : ''} </p>
          <p className="amount">{`₹${numeral(
            alertQueue[0] ? alertQueue[0].amount : 0
          ).format('0,0')}`}</p>
          <p className="subtext">
            Thank you for your contribution towards growing Chess in India!
          </p>
          <AnimationDiv ref={animationContainer}></AnimationDiv>
        </AlertOverlayBox>
      </WidgetContainer>

      <ButtonBox>
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
    </ParentBox>
  );
};

export default Alerts;
