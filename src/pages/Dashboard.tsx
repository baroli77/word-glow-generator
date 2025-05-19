
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, UserCircle, Star, Copy, Trash2, Plus, PieChart, Award } from 'lucide-react';

const Dashboard = () => {
  const savedBios = [
    { id: 1, name: 'LinkedIn Professional', platform: 'LinkedIn', date: '2025-05-10', favorite: true },
    { id: 2, name: 'Twitter Casual', platform: 'Twitter', date: '2025-05-08', favorite: false },
    { id: 3, name: 'Portfolio Bio', platform: 'Portfolio', date: '2025-05-05', favorite: true },
  ];
  
  const savedCoverLetters = [
    { id: 1, name: 'Software Developer Application', company: 'TechCorp', date: '2025-05-12', favorite: false },
    { id: 2, name: 'Marketing Position', company: 'CreativeInc', date: '2025-05-07', favorite: true },
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-12 px-4 bg-accent/20">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <div className="wordcraft-card mb-8 text-center">
                <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-wordcraft-purple to-wordcraft-pink flex items-center justify-center text-white text-4xl font-bold">
                  JD
                </div>
                <h2 className="text-xl font-semibold">John Doe</h2>
                <p className="text-muted-foreground mb-4">Free Plan</p>
                <Button variant="outline" size="sm" className="w-full">
                  Upgrade Plan
                </Button>
              </div>
              
              <div className="wordcraft-card">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase">Usage Stats</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Bios Created</span>
                      <span className="font-medium">3/3</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div 
                        className="bg-wordcraft-purple h-2 rounded-full" 
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cover Letters Created</span>
                      <span className="font-medium">1/1</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div 
                        className="bg-wordcraft-pink h-2 rounded-full" 
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase">Quick Actions</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" size="sm" className="w-full">
                      <UserCircle className="w-4 h-4 mr-2" />
                      New Bio
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      New Letter
                    </Button>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase">Daily Quote</h3>
                  <p className="text-sm italic">
                    "The best way to predict your future is to create it."
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">— Abraham Lincoln</p>
                </div>
              </div>
              
              <div className="wordcraft-card mt-8">
                <div className="flex items-center mb-4">
                  <Award className="h-5 w-5 text-wordcraft-purple mr-2" />
                  <h3 className="font-medium">Achievements</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="border rounded-md p-2 flex flex-col items-center justify-center text-center">
                    <PieChart className="h-6 w-6 text-wordcraft-purple mb-1" />
                    <span className="text-xs">First Bio</span>
                  </div>
                  <div className="border rounded-md p-2 flex flex-col items-center justify-center text-center">
                    <FileText className="h-6 w-6 text-wordcraft-purple mb-1" />
                    <span className="text-xs">First Letter</span>
                  </div>
                  <div className="border border-dashed rounded-md p-2 flex flex-col items-center justify-center text-center text-muted-foreground">
                    <Plus className="h-6 w-6 mb-1" />
                    <span className="text-xs">Keep using WordCraft!</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-3/4">
              <div className="wordcraft-card mb-8">
                <Tabs defaultValue="bios">
                  <TabsList className="mb-4 grid w-full grid-cols-2">
                    <TabsTrigger value="bios">My Bios</TabsTrigger>
                    <TabsTrigger value="coverLetters">My Cover Letters</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="bios" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="font-semibold">Saved Bios</h2>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        New Bio
                      </Button>
                    </div>
                    
                    {savedBios.map(bio => (
                      <Card key={bio.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-wordcraft-purple/20 flex items-center justify-center mr-4">
                                <UserCircle className="h-6 w-6 text-wordcraft-purple" />
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <h3 className="font-medium">{bio.name}</h3>
                                  {bio.favorite && (
                                    <Star className="h-4 w-4 text-wordcraft-purple ml-2 fill-current" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {bio.platform} • Created {bio.date}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon">
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="coverLetters" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="font-semibold">Saved Cover Letters</h2>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        New Cover Letter
                      </Button>
                    </div>
                    
                    {savedCoverLetters.map(letter => (
                      <Card key={letter.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-wordcraft-pink/20 flex items-center justify-center mr-4">
                                <FileText className="h-6 w-6 text-wordcraft-pink" />
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <h3 className="font-medium">{letter.name}</h3>
                                  {letter.favorite && (
                                    <Star className="h-4 w-4 text-wordcraft-pink ml-2 fill-current" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {letter.company} • Created {letter.date}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon">
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                      Total Bios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">3</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                      Total Cover Letters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">2</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                      Regenerations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">5</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
