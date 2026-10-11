import React, { useState, useEffect, useCallback } from 'react';
import {
  ScreenId,
  TransitRoute,
  CarpoolRide,
  MarshPassTicket,
  TransportType,
} from './types/marshgo';
import {
  MOCK_TRANSIT_ROUTES,
  MOCK_CARPOOL_ANDRIY,
  INITIAL_MARSHPASS_TICKETS,
} from './data/mockData';
import { DeviceFrame, DeviceViewMode } from './components/DeviceFrame';
import { ShowcaseExhibition } from './components/ShowcaseExhibition';
import { DesktopTabletLayout } from './components/DesktopTabletLayout';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/screens/HomeScreen';
import { SearchScreen } from './components/screens/SearchScreen';
import { ResultsScreen } from './components/screens/ResultsScreen';
import { RouteMapScreen } from './components/screens/RouteMapScreen';
import { RouteDetailsScreen } from './components/screens/RouteDetailsScreen';
import { RideDetailsScreen } from './components/screens/RideDetailsScreen';
import { MarshPassScreen } from './components/screens/MarshPassScreen';
import { PublishModal } from './components/screens/PublishModal';
import { MessagesScreen } from './components/screens/MessagesScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { triggerRatchetTick } from './utils/haptics';

const STORAGE_KEY_TICKETS = 'marshgo_tickets_v1';
const STORAGE_KEY_ROUTES = 'marshgo_routes_v1';

export default function App() {
  // Device Preview State: 'showcase' (matching photo exhibition), 'iphone', 'tablet', or 'desktop'
  const [deviceMode, setDeviceMode] = useState<DeviceViewMode>('showcase');

  // Core App State
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [currentCity, setCurrentCity] = useState<string>('Львів');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [isLiveNavigating, setIsLiveNavigating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('marshgo_dark_mode') === 'true';
    } catch (e) {
      return false;
    }
  });

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('marshgo_dark_mode', String(next));
      } catch (e) {}
      return next;
    });
  };

  // Tickets State (Initialized from localStorage or default mock)
  const [tickets, setTickets] = useState<MarshPassTicket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TICKETS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MARSHPASS_TICKETS;
  });

  // Routes State
  const [routes, setRoutes] = useState<TransitRoute[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROUTES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return MOCK_TRANSIT_ROUTES;
  });

  const [selectedRoute, setSelectedRoute] = useState<TransitRoute>(MOCK_TRANSIT_ROUTES[0]);
  const [activeRide, setActiveRide] = useState<CarpoolRide>(MOCK_CARPOOL_ANDRIY);
  const [selectedTicket, setSelectedTicket] = useState<MarshPassTicket>(
    tickets[0] || INITIAL_MARSHPASS_TICKETS[0]
  );

  // Search defaults
  const [searchOrigin, setSearchOrigin] = useState<string>('Львів, вул. Стрийська, 45');
  const [searchDestination, setSearchDestination] = useState<string>('Київ, вул. Хрещатик, 1');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(tickets));
    } catch (e) {
      console.error(e);
    }
  }, [tickets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROUTES, JSON.stringify(routes));
    } catch (e) {
      console.error(e);
    }
  }, [routes]);

  // Handlers
  const handleNavigate = (screen: ScreenId) => {
    triggerRatchetTick('minute');
    setCurrentScreen(screen);
  };

  const handleSelectDestination = (destName: string) => {
    triggerRatchetTick('date');
    setSearchOrigin(`${currentCity}, Центральний вокзал`);
    setSearchDestination(`${destName}, Центр`);
    setCurrentScreen('results');
  };

  const handleSearchSubmit = (
    origin: string,
    destination: string,
    _selectedModes: TransportType[]
  ) => {
    triggerRatchetTick('hour');
    setSearchOrigin(origin);
    setSearchDestination(destination);
    setCurrentScreen('results');
  };

  const handleSelectRoute = (route: TransitRoute) => {
    setSelectedRoute(route);
    setCurrentScreen('route-details');
  };

  const handleOpenMap = (route: TransitRoute) => {
    setSelectedRoute(route);
    setCurrentScreen('route-map');
  };

  const handleBookRoute = () => {
    // Generate new MarshPass ticket for this route
    const newCode = `MG${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: MarshPassTicket = {
      id: `ticket-${Date.now()}`,
      bookingCode: newCode,
      fromCity: selectedRoute.fromCity,
      toCity: selectedRoute.toCity,
      date: 'Сьогодні, 30 жовтня',
      departureTime: selectedRoute.departureTime,
      arrivalTime: selectedRoute.arrivalTime,
      durationFormatted: selectedRoute.durationFormatted,
      transfersCount: selectedRoute.transfersCount,
      totalCostUah: selectedRoute.totalCostUah,
      seatNumber: '1A',
      totalSeats: 4,
      carModel: activeRide.carModel,
      carPlate: activeRide.carPlate,
      driverName: activeRide.driverName,
      driverPhone: '+380 67 452 8912',
      driverRating: activeRide.driverRating,
      status: 'active',
      routeId: selectedRoute.id,
      qrPayload: `MARSHGO://TICKET/${newCode}/${selectedRoute.fromCity}-${selectedRoute.toCity}`,
      segmentsSummary: selectedRoute.segments
        .filter((s) => s.type !== 'walk')
        .map((s) => ({
          type: s.type as TransportType,
          time: s.departureTime,
          city: s.from.split(',')[0],
          cost: s.costUah,
        })),
    };

    setTickets((prev) => [newTicket, ...prev]);
    setSelectedTicket(newTicket);
    triggerRatchetTick('hour');
    showToast(`Квиток MarshPass #${newCode} успішно створено!`);
    setCurrentScreen('marshpass');
  };

  const handleBookSeat = (ride: CarpoolRide) => {
    const newCode = `MG${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: MarshPassTicket = {
      id: `ticket-${Date.now()}`,
      bookingCode: newCode,
      fromCity: ride.fromCity,
      toCity: ride.toCity,
      date: ride.departureDate,
      departureTime: ride.departureTime,
      arrivalTime: ride.arrivalTime,
      durationFormatted: '3 год 05 хв',
      transfersCount: 0,
      totalCostUah: ride.costPerSeatUah,
      seatNumber: '1A',
      totalSeats: ride.totalSeats,
      carModel: ride.carModel,
      carPlate: ride.carPlate,
      driverName: ride.driverName,
      driverPhone: '+380 67 452 8912',
      driverRating: ride.driverRating,
      status: 'active',
      carpoolId: ride.id,
      qrPayload: `MARSHGO://TICKET/${newCode}/${ride.fromCity}-${ride.toCity}`,
      segmentsSummary: [
        { type: 'carpool', time: ride.departureTime, city: ride.fromCity, cost: ride.costPerSeatUah },
      ],
    };

    setTickets((prev) => [newTicket, ...prev]);
    setSelectedTicket(newTicket);
    triggerRatchetTick('hour');
    showToast(`Місце у ${ride.driverName} заброньовано! Код: ${newCode}`);
    setCurrentScreen('marshpass');
  };

  const handleCancelTicket = (ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    if (selectedTicket?.id === ticketId) {
      const remaining = tickets.filter((t) => t.id !== ticketId);
      if (remaining.length > 0) {
        setSelectedTicket(remaining[0]);
      }
    }
    showToast('Квиток скасовано.');
    triggerRatchetTick('minute');
  };

  const handlePublishDriverRide = (newRideData: Partial<CarpoolRide>) => {
    const newRide: CarpoolRide = {
      ...MOCK_CARPOOL_ANDRIY,
      id: `carpool-${Date.now()}`,
      fromCity: newRideData.fromCity || currentCity,
      fromAddress: newRideData.fromAddress || `${currentCity}, Центр`,
      toCity: newRideData.toCity || 'Київ',
      toAddress: newRideData.toAddress || 'вул. Хрещатик, 1',
      departureDate: newRideData.departureDate || 'Сьогодні, 30 жовтня',
      departureTime: newRideData.departureTime || '15:30',
      carModel: newRideData.carModel || 'Volkswagen Passat B8',
      carPlate: newRideData.carPlate || 'BC 9988 EK',
      costPerSeatUah: newRideData.costPerSeatUah || 300,
      availableSeats: newRideData.availableSeats || 3,
    };

    setActiveRide(newRide);

    // Also add to routes
    const newRoute: TransitRoute = {
      id: `route-${Date.now()}`,
      title: 'Пряма попутка (новий водій)',
      tagType: 'fastest',
      fromCity: newRide.fromCity,
      fromAddress: newRide.fromAddress,
      toCity: newRide.toCity,
      toAddress: newRide.toAddress,
      departureTime: newRide.departureTime,
      arrivalTime: '20:10',
      durationFormatted: '4 год 40 хв',
      transfersCount: 0,
      totalCostUah: newRide.costPerSeatUah,
      isDirectCarpool: true,
      polylineCoordinates: [
        [49.8397, 24.0297],
        [50.4501, 30.5234],
      ],
      segments: [
        {
          id: `seg-${Date.now()}`,
          type: 'carpool',
          title: `Попутка (${newRide.driverName})`,
          subtitle: `${newRide.carModel} • ${newRide.carPlate}`,
          driverName: newRide.driverName,
          from: newRide.fromAddress,
          to: newRide.toAddress,
          departureTime: newRide.departureTime,
          arrivalTime: '20:10',
          durationMinutes: 280,
          costUah: newRide.costPerSeatUah,
        },
      ],
    };

    setRoutes((prev) => [newRoute, ...prev]);
    setSelectedRoute(newRoute);
  };

  const handleToggleDemoTicket = () => {
    triggerRatchetTick('minute');
    if (tickets.length > 0) {
      setTickets([]);
      showToast('Перемкнуто до стану без квитків');
    } else {
      setTickets(INITIAL_MARSHPASS_TICKETS);
      setSelectedTicket(INITIAL_MARSHPASS_TICKETS[0]);
      showToast('Активовано демо квиток MarshPass');
    }
  };

  const handleResetData = () => {
    triggerRatchetTick('date');
    setTickets(INITIAL_MARSHPASS_TICKETS);
    setRoutes(MOCK_TRANSIT_ROUTES);
    setSelectedTicket(INITIAL_MARSHPASS_TICKETS[0]);
    setSelectedRoute(MOCK_TRANSIT_ROUTES[0]);
    setCurrentCity('Львів');
    setCurrentScreen('home');
    showToast('Демо дані MARSHGO скинуто до початкових!');
  };

  return (
    <DeviceFrame
      deviceMode={deviceMode}
      setDeviceMode={setDeviceMode}
      onResetData={handleResetData}
      hasActiveTickets={tickets.length > 0}
      onToggleDemoTicket={handleToggleDemoTicket}
      darkMode={darkMode}
      onToggleDarkMode={handleToggleDarkMode}
      toastMessage={toastMessage}
      onCloseToast={() => setToastMessage(null)}
      isNavigating={isLiveNavigating}
      currentScreen={currentScreen}
      onSelectScreen={(s) => {
        setCurrentScreen(s);
        setDeviceMode('iphone');
      }}
      showcaseLayout={
        <ShowcaseExhibition
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onSelectScreenToInteract={(s) => {
            setCurrentScreen(s);
            setDeviceMode('iphone');
          }}
        />
      }
      desktopLayout={
        <DesktopTabletLayout
          currentCity={currentCity}
          onCityChange={setCurrentCity}
          routes={routes}
          selectedRoute={selectedRoute}
          onSelectRoute={setSelectedRoute}
          tickets={tickets}
          selectedTicket={selectedTicket}
          onSelectTicket={setSelectedTicket}
          activeRide={activeRide}
          onBookRoute={handleBookRoute}
          onBookSeat={handleBookSeat}
          onCancelTicket={handleCancelTicket}
          onOpenPublish={() => setIsPublishModalOpen(true)}
          onNavigateToChat={() => {
            setCurrentScreen('messages');
            setDeviceMode('iphone');
          }}
          onNavigateToProfile={() => {
            setCurrentScreen('profile');
            setDeviceMode('iphone');
          }}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onShowToast={showToast}
        />
      }
    >
      {/* App Header (shown on Home or top-level tabs) */}
      {(currentScreen === 'home' || currentScreen === 'profile') && (
        <Header
          currentCity={currentCity}
          onCityChange={setCurrentCity}
          onNavigate={handleNavigate}
        />
      )}

      {/* Screen Router */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {currentScreen === 'home' && (
          <HomeScreen
            tickets={tickets}
            onNavigate={handleNavigate}
            onOpenPublish={() => setIsPublishModalOpen(true)}
            onSelectDestination={handleSelectDestination}
            onSelectTicket={(ticket) => {
              setSelectedTicket(ticket);
              setCurrentScreen('marshpass');
            }}
          />
        )}

        {currentScreen === 'search' && (
          <SearchScreen
            defaultOrigin={searchOrigin}
            defaultDestination={searchDestination}
            onBack={() => setCurrentScreen('home')}
            onSearchSubmit={handleSearchSubmit}
          />
        )}

        {currentScreen === 'results' && (
          <ResultsScreen
            routes={routes}
            onBack={() => setCurrentScreen('search')}
            onSelectRoute={handleSelectRoute}
            onOpenMap={handleOpenMap}
          />
        )}

        {currentScreen === 'route-map' && (
          <RouteMapScreen
            route={selectedRoute}
            onBack={() => {
              setIsLiveNavigating(false);
              setCurrentScreen('results');
            }}
            onShowDetails={() => setCurrentScreen('route-details')}
            initialNavigating={isLiveNavigating}
          />
        )}

        {currentScreen === 'route-details' && (
          <RouteDetailsScreen
            route={selectedRoute}
            onBack={() => setCurrentScreen('results')}
            onOpenRideDetails={() => setCurrentScreen('ride-details')}
            onBookRoute={handleBookRoute}
            onStartNavigation={() => {
              setIsLiveNavigating(true);
              setCurrentScreen('route-map');
            }}
          />
        )}

        {currentScreen === 'ride-details' && (
          <RideDetailsScreen
            ride={activeRide}
            onBack={() => setCurrentScreen('route-details')}
            onBookSeat={handleBookSeat}
            onNavigateToChat={() => setCurrentScreen('messages')}
          />
        )}

        {(currentScreen === 'marshpass' || currentScreen === 'marshpass-details') && (
          <MarshPassScreen
            ticket={selectedTicket || tickets[0] || INITIAL_MARSHPASS_TICKETS[0]}
            onBack={() => setCurrentScreen('home')}
            onCancelTicket={handleCancelTicket}
            onNavigateToChat={() => setCurrentScreen('messages')}
          />
        )}

        {currentScreen === 'messages' && (
          <MessagesScreen onBack={() => setCurrentScreen('home')} />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            tickets={tickets}
            onBack={() => setCurrentScreen('home')}
            onSelectTicket={(t) => {
              setSelectedTicket(t);
              setCurrentScreen('marshpass');
            }}
            onNavigate={handleNavigate}
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />
        )}
      </div>

      {/* 5-Tab Bottom Navigation Bar (Persistent across screens) */}
      <BottomNav
        activeScreen={currentScreen}
        onNavigate={handleNavigate}
        onOpenPublish={() => setIsPublishModalOpen(true)}
      />

      {/* Publish Trip / Request Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onPublishDriverRide={handlePublishDriverRide}
        onPublishPassengerRequest={(req) => {
          showToast(`Запит пасажира ${req.fromCity} → ${req.toCity} опубліковано!`);
        }}
        onSuccessToast={showToast}
      />
    </DeviceFrame>
  );
}
