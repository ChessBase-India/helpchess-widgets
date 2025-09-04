import styled from 'styled-components';
import { useState, useEffect, useRef, useCallback } from 'react';
import lottie from 'lottie-web';
import animationData from '../../../public/confetti.json';
import moment from 'moment';
import numeral from 'numeral';

const ParentBox = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 1rem;
`;

const DashboardContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  height: 800px;
  max-height: 800px;
  background: linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%);
  display: flex;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 1200px) {
    flex-direction: column;
    height: 800px;
    max-height: 800px;
  }
`;

const LeftSection = styled.div`
  width: 45%;
  height: 100%;
  background: linear-gradient(180deg, #252525 0%, #1e1e1e 100%);
  padding: 2rem;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
  }
  
  @media (max-width: 1200px) {
    width: 100%;
    height: 400px;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    &::before {
      display: none;
    }
  }
`;

const RightSection = styled.div`
  width: 55%;
  height: 100%;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: linear-gradient(180deg, #1f1f1f 0%, #1a1a1a 100%);
  position: relative;
  overflow: hidden;
  
  @media (max-width: 1200px) {
    width: 100%;
    height: 400px;
  }
`;

const SectionTitle = styled.h2`
  color: #ffffff;
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  letter-spacing: 1.5px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #4a90e2, #7b68ee);
    border-radius: 2px;
  }
`;

const DonorsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  min-height: 0;
  
  &::-webkit-scrollbar {
    width: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(128, 128, 128, 0.3);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(128, 128, 128, 0.5);
  }
`;

const DonorItem = styled.div`
  background: linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%);
  margin-bottom: 1rem;
  padding: 1.2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  opacity: ${({ $isNew }) => ($isNew ? 0 : 1)};
  transform: translateY(${({ $isNew }) => ($isNew ? '-20px' : '0')});
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 191, 255, 0.8), transparent);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 191, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
  
  &.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 8px 20px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    border-color: rgba(0, 191, 255, 0.3);
  }

  .donor-name {
    color: #ffffff;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.8rem;
    letter-spacing: 0.5px;
  }

  .donor-amount {
    color: #00bfff;
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-shadow: 0 0 15px rgba(0, 191, 255, 0.5);
  }

  .donor-time {
    color: #888;
    font-size: 0.95rem;
    font-weight: 400;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const StatCard = styled.div`
  background: linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%);
  padding: 1.2rem;
  border-radius: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 191, 255, 0.9), transparent);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at top, rgba(0, 191, 255, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 12px 30px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    border-color: rgba(0, 191, 255, 0.4);
  }

  .stat-number {
    color: #00bfff;
    font-size: 2.2rem;
    font-weight: 800;
    margin-bottom: 0.6rem;
    text-shadow: 0 0 25px rgba(0, 191, 255, 0.6);
    letter-spacing: 1px;
  }

  .stat-label {
    color: #ffffff;
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    opacity: 0.9;
  }
`;

const TopDonorsSection = styled.div`
  flex: 1;
  min-height: 0;
`;

const TopDonorsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const TopDonorCard = styled.div`
  background: linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%);
  padding: 1.2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.8), transparent);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 6px 16px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 215, 0, 0.3);
  }

  .period {
    color: #ffd700;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 0.8rem;
    letter-spacing: 1px;
    opacity: 0.9;
  }

  .donor-name {
    color: #ffffff;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    letter-spacing: 0.3px;
  }

  .donor-amount {
    color: #ffd700;
    font-size: 1.3rem;
    font-weight: 700;
    text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
  }
`;

const AlertBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
  transform: ${({ $alert }) => ($alert ? `translateY(0)` : `translateY(100%)`)};
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: ${({ $alert }) => ($alert ? `10` : `-1`)};
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(0, 191, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  .title {
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: #ffffff;
    text-transform: uppercase;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
    transform: ${({ $alert }) => ($alert ? `translateY(0)` : `translateY(20px)`)};
    transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s;
  }

  .amount {
    font-size: 3.5rem;
    font-weight: 800;
    letter-spacing: 2px;
    color: #4a90e2;
    text-shadow: 0 0 30px rgba(74, 144, 226, 0.6);
    transform: ${({ $alert }) => ($alert ? `translateY(0)` : `translateY(20px)`)};
    transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s;
  }

  .subtext {
    color: #cccccc;
    font-size: 1.4rem;
    font-weight: 400;
    letter-spacing: 1px;
    opacity: 0.9;
    max-width: 600px;
    line-height: 1.4;
    transform: ${({ $alert }) => ($alert ? `translateY(0)` : `translateY(20px)`)};
    transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s;
  }
`;

const AnimationDiv = styled.div`
  position: absolute;
    inset: 0;

  pointer-events: none;
  overflow: hidden;
  
  svg {

    height: 100% !important;
  }
`;

const WebsiteHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
  
  .website-link {
    color: #ffffff;
    font-size: 2.2rem;
    font-weight: 700;
    letter-spacing: 2px;
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
    position: relative;
    margin-bottom: 0.8rem;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #4a90e2, transparent);
      border-radius: 1px;
    }
  }
  
  .mission-text {
    color: #cccccc;
    font-size: 1.2rem;
    font-weight: 400;
    letter-spacing: 0.5px;
    line-height: 1.4;
    max-width: 600px;
    margin: 0 auto;
    opacity: 0.9;
  }
`;

const TestButton = styled.button`
  position: fixed;
  top: 2rem;
  right: 2rem;
  padding: 1rem 2rem;
  background: linear-gradient(145deg, #4a90e2, #7b68ee);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: 
    0 4px 15px rgba(74, 144, 226, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  z-index: 1000;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 6px 20px rgba(74, 144, 226, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Dashboard = () => {
  const newDonationAudio = useCallback(() => {
    return typeof window !== 'undefined'
      ? new Audio('/audio/new-donation.webm')
      : null;
  }, []);

  const [stats, setStats] = useState({
    believersCount: 0,
    bigBelieversCount: 0,
    topDonors: {
      today: null,
      weekly: null,
      monthly: null,
      allTime: null,
    },
  });
  
  const [recentDonors, setRecentDonors] = useState([]);
  const [previousDonors, setPreviousDonors] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertQueue, setAlertQueue] = useState([]);
  const [checking, setChecking] = useState(false);
  const [newDonorAnimations, setNewDonorAnimations] = useState(new Set());

  const animationContainer = useRef(null);
  const lottieAnimation = useRef(null);

  const checkForAlerts = useCallback(() => {
    if (!alertQueue.length || checking) {
      return;
    }
    setChecking(true);
    setShowAlert(true);

    const alertAudio = newDonationAudio();
    if (alertAudio) {
      alertAudio.play().catch(console.error);
    }

    // Play lottie animation after alert slides in (with a small delay)
    setTimeout(() => {
      if (lottieAnimation.current) {
        lottieAnimation.current.goToAndPlay(0);
      }
    }, 800);

    const timeout = setTimeout(() => {
      setShowAlert(false);
      setChecking(false);
      setAlertQueue((prev) => prev.slice(1));
    }, 10000);
    
    return () => clearTimeout(timeout);
  }, [alertQueue, checking, newDonationAudio]);

  useEffect(() => {
    const alertsInterval = setInterval(checkForAlerts, 2000);
    return () => clearInterval(alertsInterval);
  }, [checkForAlerts]);

  useEffect(() => {
    if (animationContainer.current) {
      const anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: animationData,
      });

      // Store the animation reference
      lottieAnimation.current = anim;

      // Ensure the animation fills the container
      anim.addEventListener('DOMLoaded', () => {
        const svg = animationContainer.current.querySelector('svg');
        if (svg) {
          svg.style.width = '100%';
          svg.style.height = '100%';
        }
      });

      return () => {
        anim.destroy();
        lottieAnimation.current = null;
      };
    }
  }, []);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://api-v2.chessbase.in/v2/hc/widget-stats');
        const data = await response.json();
        if (data.ok && data.data) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    const statsInterval = setInterval(fetchStats, 10000);
    return () => clearInterval(statsInterval);
  }, []);

  // Fetch donors
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch('https://api-v2.chessbase.in/v1/hc/donors');
        const data = await response.json();
        console.log('Donors API response:', data); // Debug log
        if (data.ok && data.data && data.data.recentDonors) {
          console.log('Setting recent donors:', data.data.recentDonors.slice(0, 8)); // Debug log
          setRecentDonors(data.data.recentDonors.slice(0, 8));
        } else {
          console.log('No recent donors found in response:', data); // Debug log
        }
      } catch (error) {
        console.error('Error fetching donors:', error);
      }
    };

    fetchDonors();
    const donorsInterval = setInterval(fetchDonors, 5000);
    return () => clearInterval(donorsInterval);
  }, []);

  const checkForNewDonors = useCallback((newDonors) => {
    if (previousDonors.length === 0) {
      return;
    }
    
    const newAlertQueue = [...alertQueue, ...newDonors];
    setAlertQueue(newAlertQueue);
    
    // Mark new donors for animation
    const newAnimations = new Set(newDonorAnimations);
    newDonors.forEach(donor => {
      newAnimations.add(donor.id);
    });
    setNewDonorAnimations(newAnimations);
    
    // Remove animation markers after a delay
    setTimeout(() => {
      setNewDonorAnimations(new Set());
    }, 1000);
  }, [alertQueue, previousDonors, newDonorAnimations]);

  useEffect(() => {
    const newDonors = recentDonors.filter(
      (donor) => !previousDonors.find((prevDonor) => prevDonor.id === donor.id)
    );

    setPreviousDonors(recentDonors);

    if (newDonors.length > 0) {
      checkForNewDonors(newDonors);
    }
  }, [recentDonors, checkForNewDonors, previousDonors]);

  const formatAmount = (amount) => {
    return `₹${numeral(amount).format('0,0')}`;
  };

  // Debug log for recentDonors
  useEffect(() => {
    console.log('Recent donors state updated:', recentDonors);
  }, [recentDonors]);

  const formatTopDonor = (donor) => {
    if (!donor) return null;
    return {
      name: donor.name,
      amount: formatAmount(donor.amount),
      date: moment.unix(donor.date).fromNow(),
    };
  };

  const triggerTestAlert = () => {
    const testDonor = {
      id: 'test-' + Date.now(),
      name: 'Test Donor',
      amount: Math.floor(Math.random() * 5000) + 1000,
      date: new Date().toISOString(),
    };
    
    setAlertQueue(prev => [...prev, testDonor]);
  };

  return (
    <ParentBox>
      <TestButton onClick={triggerTestAlert}>
        Test Alert
      </TestButton>
      
      <DashboardContainer>

        <LeftSection>
          <SectionTitle>Latest Donors</SectionTitle>
          <DonorsList>
            {recentDonors.length > 0 ? (
              recentDonors.map((donor, index) => (
                <DonorItem 
                  key={donor.id || index}
                  $isNew={newDonorAnimations.has(donor.id)}
                  className={newDonorAnimations.has(donor.id) ? 'animate-in' : ''}
                >
                  <div className="donor-name">
                    {donor.name.length > 25 
                      ? donor.name.slice(0, 25) + '...' 
                      : donor.name
                    }
                  </div>
                  <div className="donor-amount">{formatAmount(donor.amount)}</div>
                  <div className="donor-time">{moment(donor.date).fromNow()}</div>
                </DonorItem>
              ))
            ) : (
              <DonorItem>
                <div className="donor-name">Loading donors...</div>
                <div className="donor-amount">Please wait</div>
                <div className="donor-time">Fetching data</div>
              </DonorItem>
            )}
          </DonorsList>
        </LeftSection>

        <RightSection>
          <WebsiteHeader>
            <p className="website-link">www.HelpChess.org</p>
            <p className="mission-text">
              Join India&apos;s largest chess charity in our mission of supporting 1000 chess players and be a part of Indian Chess history.
            </p>
          </WebsiteHeader>

          <AlertBox $alert={showAlert}>
            <p className="title">{alertQueue[0] ? alertQueue[0].name : ''}</p>
            <p className="amount">
              {alertQueue[0] ? formatAmount(alertQueue[0].amount) : ''}
            </p>
            <p className="subtext">
              Thank you for your contribution towards growing Chess in India!
            </p>
            <AnimationDiv ref={animationContainer}></AnimationDiv>
          </AlertBox>

          <StatsGrid>
            <StatCard>
              <div className="stat-number">{numeral(stats.believersCount).format('0,0')}</div>
              <div className="stat-label">Believers</div>
            </StatCard>
            <StatCard>
              <div className="stat-number">{numeral(stats.bigBelieversCount).format('0,0')}</div>
              <div className="stat-label">Big Believers</div>
            </StatCard>
          </StatsGrid>

          <TopDonorsSection>
            <SectionTitle>Top Donors</SectionTitle>
            <TopDonorsGrid>
              {stats.topDonors.today && (
                <TopDonorCard>
                  <div className="period">Today</div>
                  <div className="donor-name">{stats.topDonors.today.name}</div>
                  <div className="donor-amount">{formatAmount(stats.topDonors.today.amount)}</div>
                </TopDonorCard>
              )}
              {stats.topDonors.weekly && (
                <TopDonorCard>
                  <div className="period">This Week</div>
                  <div className="donor-name">{stats.topDonors.weekly.name}</div>
                  <div className="donor-amount">{formatAmount(stats.topDonors.weekly.amount)}</div>
                </TopDonorCard>
              )}
              {stats.topDonors.monthly && (
                <TopDonorCard>
                  <div className="period">This Month</div>
                  <div className="donor-name">{stats.topDonors.monthly.name}</div>
                  <div className="donor-amount">{formatAmount(stats.topDonors.monthly.amount)}</div>
                </TopDonorCard>
              )}
              {stats.topDonors.allTime && (
                <TopDonorCard>
                  <div className="period">All Time</div>
                  <div className="donor-name">{stats.topDonors.allTime.name}</div>
                  <div className="donor-amount">{formatAmount(stats.topDonors.allTime.amount)}</div>
                </TopDonorCard>
              )}
            </TopDonorsGrid>
          </TopDonorsSection>
        </RightSection>
      </DashboardContainer>
    </ParentBox>
  );
};

export default Dashboard;
