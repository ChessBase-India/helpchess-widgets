import styled, { keyframes } from 'styled-components';
import { useState, useEffect } from 'react';

import AnimateUp from '@/components/AnimateUp';

const animationDelay = 80;

const ParentBox = styled.div`
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
  width: 400px;
  height: 100px;
  background-color: #212121;
`;

const AlertContainer = styled.div`
  width: 600px;
  height: 300px;
  border: 2px dotted black;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AlertBox = styled.div`
  width: 100%;
  height: fit-content;
  background-color: #212121;
  text-align: center;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-radius: 50px;

  .title {
    font-size: 1rem;
    font-weight: bold;
    letter-spacing: 1.5px;
  }

  .subtext {
    color: #7bd3ea;
    font-size: 0.8rem;
    letter-spacing: 1.2px;
  }

  .description {
    position: absolute;
    top: -30%;
    left: 0;
    right: 0;
    width: fit-content;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
    background-color: #ebc49f;
    color: #212121;
    padding: 0.2rem 1rem;
    border-radius: 50px;
  }
`;

const HCLogo = styled.img`
  width: 50%;
  height: 50px;
  margin-left: 4px;
  margin-top: 4px;
`;

const TopBar = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  gap: 0.5rem;
`;

const BottomBar = styled.div`
  width: 100%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #ebc49f;
`;

const StatsBox = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #7bd3ea;
  gap: 2rem;
`;

const WebsiteLink = styled.p`
  color: #ebc49f;
  font-weight: bold;
  letter-spacing: 1.2px;
`;

const StatNumbers = styled.p`
  font-weight: bold;
  font-size: 1.4rem;
  letter-spacing: 1.5px;
`;

const marqueeAnimation = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-100%, 0);
  }
`;

const Marquee = styled.div`
  margin: 0 auto;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
`;

const MarqueeSpan = styled.span`
  display: inline-block;
  padding-left: 100%;
  animation: ${marqueeAnimation} ${animationDelay}s linear infinite;
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 2px;
  color: #212121;
`;

const Marquee2Span = styled(MarqueeSpan)`
  animation-delay: ${animationDelay / 2}s;
`;

const statsElementStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '0.5rem',
};

const Widget001 = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [counts, setCounts] = useState({ believers: 0, bigBelievers: 0 });
  const [recentDonors, setRecentDonors] = useState([]);
  const [previousDonors, setPreviousDonors] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % 2);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api-v2-stage.chessbase.in/v1/hc/widget-stats'
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

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api-v2-stage.chessbase.in/v1/hc/donors'
        );
        const data = await response.json();
        if (data.ok && data.data && data.data.recentDonors) {
          setRecentDonors(data.data.recentDonors);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data initially
    fetchData();

    // Polling interval (every 5 seconds in this example)
    const interval = setInterval(fetchData, 5000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const checkForNewDonors = (newDonors) => {
    // Do something with new donors
    console.log('New donors:', newDonors);
  };

  useEffect(() => {
    // Compare with the previous donors to identify new ones
    const newDonors = recentDonors.filter(
      (donor) => !previousDonors.find((prevDonor) => prevDonor.id === donor.id)
    );

    // Update the previous donors
    setPreviousDonors(recentDonors);

    // Do something with new donors
    if (newDonors.length > 0) {
      checkForNewDonors(newDonors);
    }
  }, [recentDonors]);

  let donorsString = '';
  recentDonors.forEach((donor) => {
    donorsString += `${donor.name} - ₹${donor.amount} • `;
  });

  return (
    <ParentBox>
      <AlertContainer>
        <AnimateUp>
          <AlertBox>
            <p className="description">Helpchess.org</p>
            <p className="title">Adarsh Bhadauria donated Rs. 4000/-</p>
            <p className="subtext">
              Thanks for your contribution towards growing Chess in India!
            </p>
          </AlertBox>
        </AnimateUp>
      </AlertContainer>
      <WidgetContainer>
        <TopBar>
          <WebsiteLink>www.helpchess.org</WebsiteLink>
          <StatsBox>
            <div style={statsElementStyle}>
              <StatNumbers>{counts.believers}</StatNumbers>
              <p>BELIEVERS</p>
            </div>
            <div style={statsElementStyle}>
              <StatNumbers>{counts.bigBelievers}</StatNumbers>
              <p>BIG BELIEVERS</p>
            </div>
          </StatsBox>
        </TopBar>
        <BottomBar>
          <Marquee>
            <MarqueeSpan>{donorsString}</MarqueeSpan>
            <Marquee2Span>{donorsString}</Marquee2Span>
          </Marquee>
        </BottomBar>
      </WidgetContainer>
    </ParentBox>
  );
};

export default Widget001;
