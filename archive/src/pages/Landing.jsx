
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from 'lucide-react';

const Landing = () => {
  const [dronePort, setDronePort] = useState('8000');
  const [droneHost, setDroneHost] = useState('localhost');
  const navigate = useNavigate();

  const handleConnect = () => {
    navigate(`/dashboard?host=${droneHost}&port=${dronePort}`);
  };

  const handleDemo = () => {
    navigate('/dashboard?demo=true');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent mb-2">
            Maverick Admin Panel
          </h1>
          <p className="text-xl text-foreground">MAP</p>
          <p className="text-sm text-muted-foreground mt-2">Drone Monitoring Dashboard</p>
        </div>

        <Tabs defaultValue="connect" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="connect">Connect to Drone</TabsTrigger>
            <TabsTrigger value="demo">Demo Mode</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connect">
            <Card>
              <CardHeader>
                <CardTitle>Connect to Your Drone</CardTitle>
                <CardDescription>
                  Enter the WebSocket connection details for your drone.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="host">Host</Label>
                  <Input 
                    id="host" 
                    placeholder="localhost" 
                    value={droneHost}
                    onChange={(e) => setDroneHost(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input 
                    id="port" 
                    placeholder="8000" 
                    value={dronePort}
                    onChange={(e) => setDronePort(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleConnect} className="w-full">
                  <Navigation className="mr-2 h-4 w-4" />
                  Connect
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="demo">
            <Card>
              <CardHeader>
                <CardTitle>Demo Mode</CardTitle>
                <CardDescription>
                  Explore the dashboard using simulated drone data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This mode uses mock data to demonstrate the dashboard features without requiring a physical drone connection.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={handleDemo} variant="default" className="w-full">
                  Launch Demo
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Landing;
