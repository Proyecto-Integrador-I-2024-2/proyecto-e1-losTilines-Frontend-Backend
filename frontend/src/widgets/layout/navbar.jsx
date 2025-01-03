import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronUpIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const nestedMenuItems = [
  { title: "Hero" },
  { title: "Features" },
  { title: "Testimonials" },
  { title: "Ecommerce" },
];

function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openNestedMenu, setOpenNestedMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");
  const renderItems = nestedMenuItems.map(({ title }, key) => (
    <div key={key}>
      <MenuItem>{title}</MenuItem>
    </div>
  ));

  return (
    <>
      <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom" allowHover={true}>
        <MenuHandler>
          <Typography as="div" variant="small" className="font-semibold">
            <ListItem
              className="flex items-center gap-2 py-2 pr-4 font-medium text-gray-900"
              selected={isMenuOpen || isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}
            >
              Options
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`hidden h-3 w-3 transition-transform lg:block ${isMenuOpen ? "rotate-180" : ""
                  }`}
              />
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`block h-3 w-3 transition-transform lg:hidden ${isMobileMenuOpen ? "rotate-180" : ""
                  }`}
              />
            </ListItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden rounded-xl lg:block">
          <Menu placement="right-start" allowHover offset={15} open={openNestedMenu} handler={setOpenNestedMenu}>
            <MenuHandler className="flex items-center justify-between">
              <MenuItem>
                Projects
                <ChevronUpIcon
                  strokeWidth={2.5}
                  className={`h-3.5 w-3.5 transition-transform ${isMenuOpen ? "rotate-90" : ""}`}
                />
              </MenuItem>
            </MenuHandler>
            <MenuList className="rounded-xl">{renderItems}</MenuList>
          </Menu>
          <MenuItem onClick={() => navigate(`/approvals/${(role === "Freelancer") ? "freelancer" : "project-management"}`)}>Approvals</MenuItem>
          <MenuItem onClick={() => navigate("/faq")}>FAQ</MenuItem>
        </MenuList>
      </Menu>
      <div className="block lg:hidden">
        <Collapse open={isMobileMenuOpen}>
          <Menu placement="bottom" allowHover offset={6} open={openNestedMenu} handler={setOpenNestedMenu}>
            <MenuHandler className="flex items-center justify-between">
              <MenuItem>
                Figma
                <ChevronUpIcon
                  strokeWidth={2.5}
                  className={`h-3.5 w-3.5 transition-transform ${isMenuOpen ? "rotate-90" : ""}`}
                />
              </MenuItem>
            </MenuHandler>
            <MenuList className="block rounded-xl lg:hidden">{renderItems}</MenuList>
          </Menu>
          <MenuItem>React</MenuItem>
          <MenuItem>TailwindCSS</MenuItem>
        </Collapse>
      </div>
    </>
  );
}

function NavList() {
  const navigate = useNavigate();

  return (
    <List className="mb-6 mt-4 p-0 lg:mb-0 lg:mt-0 lg:flex-row lg:p-1">
      <ListItem className="flex items-center gap-2 py-2 pr-4" ripple={false} selected={false} onClick={() => navigate("/profile")}>
        <Typography id="profileNavbar" variant="small" color="blue-gray" className="font-medium cursor-pointer" >
          Profile
        </Typography>
      </ListItem>
      <ListItem className="flex items-center gap-2 py-2 pr-4" ripple={false} selected={false} onClick={() => navigate("/dashboard")}>
        <Typography id="dashboardNavbar" variant="small" color="blue-gray" className="font-medium cursor-pointer" >
          Dashboard
        </Typography>
      </ListItem>
      <ListItem className="flex items-center gap-2 py-2 pr-4" ripple={false} selected={false} onClick={() => navigate("/project/")}>
        <Typography id="projectsNavbar" variant="small" color="blue-gray" className="font-medium cursor-pointer" >
          Projects
        </Typography>
      </ListItem>
      <ListItem className="flex items-center gap-2 py-2 pr-4" ripple={false} selected={false} onClick={() => navigate("/search/")}>
        <Typography id="searchNavbar" variant="small" color="blue-gray" className="font-medium cursor-pointer" >
          Search
        </Typography>
      </ListItem>
      <NavListMenu />
    </List>
  );
}

export function NavigationTopBar() {
  const [openNav, setOpenNav] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const socketRef = useRef(null); // Ref to store the WebSocket instance
  const tokenRef = useRef(sessionStorage.getItem("token")); // Ref to store the token
  const token = tokenRef.current;

  function handleLogOut() {
    queryClient.clear();
    sessionStorage.clear();
    navigate("/");
  }

  // Memoized WebSocket connection function
  const connectWebSocket = useCallback(() => {
    // Prevent multiple connections
    if (socketRef.current) {
      return;
    }

    // Establish the WebSocket connection
    const socket = new WebSocket(
      `ws://localhost:29000/ws/notifications/?token=${token}`
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data.message);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        data.message,
      ]);
    };

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onclose = (event) => {
      console.log("WebSocket closed:", event);
      socketRef.current = null;
      setTimeout(connectWebSocket, 5000);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current = socket;
  }, [token]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpenNav(false);
    };

    window.addEventListener("resize", handleResize);

    connectWebSocket(); // Establish the WebSocket connection

    return () => {
      // Clean up on component unmount
      if (socketRef.current) {
        socketRef.current.close();
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [connectWebSocket]); // Dependency array contains connectWebSocket

  return (
    <Navbar className="mx-auto max-w-full px-4 py-2">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Link to="/">
          <Typography variant="h6" className="mr-4 cursor-pointer py-1.5 lg:ml-2">
            Freelance Now
          </Typography>
        </Link>
        <div className="hidden lg:block">
          <NavList />
        </div>
        <div className="relative">
          <IconButton variant="text" onClick={() => setOpenNav(!openNav)}>
            {notifications.length > 0 && (
              <span className="absolute right-0 top-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                {notifications.length}
              </span>
            )}
            <BellIcon className="h-6 w-6" strokeWidth={2} />
          </IconButton>
        </div>
        <Button id="logInOutButton" variant="outlined" size="sm" onClick={token ? handleLogOut : () => navigate("/auth/sign-in")}>
          Log {token ? "out" : "in"}
        </Button>
        <IconButton variant="text" className="lg:hidden" onClick={() => setOpenNav(!openNav)}>
          {openNav ? <XMarkIcon className="h-6 w-6" strokeWidth={2} /> : <Bars3Icon className="h-6 w-6" strokeWidth={2} />}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList />
        <div className="flex w-full flex-nowrap items-center gap-2 lg:hidden">
          <Button size="sm" fullWidth onClick={() => navigate("/auth/sign-up")}>
            Get Started
          </Button>
          <Button variant="outlined" size="sm" fullWidth onClick={() => navigate("/auth/sign-in")}>
            Log In
          </Button>
        </div>
      </Collapse>
      {notifications.length > 0 && (
        <div className="p-4">
          {notifications.map((notification, index) => (
            <div key={index} className="mb-2 rounded bg-gray-100 p-2">
              {notification}
            </div>
          ))}
        </div>
      )}
    </Navbar>
  );
}

export default NavigationTopBar;