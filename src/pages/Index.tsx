import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { AvatarUpload } from '@/components/AvatarUpload';
import { BossAvatar } from '@/components/BossAvatar';
import { toast } from 'sonner';
import { generateBossReport } from '../lib/feedbackUtils';
import { Input } from '@/components/ui/input';
import emailjs from '@emailjs/browser';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'venting'>('upload');
  const [isRecording, setIsRecording] = useState(false);
  const [ventText, setVentText] = useState('');
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [bossExpression, setBossExpression] = useState<'neutral' | 'shocked'>('neutral');
  const [bossEmail, setBossEmail] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Use a ref for isRecording to get the latest value in callbacks without re-creating them.
  const isRecordingRef = useRef(isRecording);
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const setupSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      toast.error("Speech recognition is not supported in this browser.");
      return null;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      // When we get any result, we know the user is talking.
      setBossExpression('shocked');

      // Clear any existing silence timer.
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript.trim()) {
        setVentText(prev => (prev.trim() + ' ' + finalTranscript.trim()).trim());
      }
      
      // Set a new timer. If no new results come in for 2 seconds, we assume they stopped talking.
      silenceTimerRef.current = setTimeout(() => {
        console.log('Custom silence timer expired, reverting to neutral.');
        setBossExpression('neutral');
      }, 2000); // 2-second pause detection.
    };
    
    recognition.onend = () => {
      // When recognition service ends, restart it if we are still in "recording" mode.
      if (isRecordingRef.current) {
        console.log("Speech recognition service ended, restarting for continuous venting...");
        recognition.start();
      }
    };
    
    return recognition;
  }, []);

  const startVenting = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error("Error getting microphone permission:", err);
      toast.error("Microphone permission is required to start venting.");
      return;
    }

    const recognition = setupSpeechRecognition();
    if (!recognition) return;
    
    recognitionRef.current = recognition;
    
    setIsRecording(true);
    setCurrentStep('venting');
    
    recognition.start();
    
    toast.success('Start venting! I\'m listening...');
  };

  const stopVenting = () => {
    setIsRecording(false); // This updates the ref and stops the onend restart loop.
    
    // Clear the silence timer if it's active
    if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    // Immediately set expression to neutral when stopping.
    setBossExpression('neutral');
    
    const bossReport = generateBossReport(ventText);

    const templateParams = {
      boss_email: bossEmail,
      rephrased_vent_statements: bossReport.rephrased_vent_statements,
      suggestions_for_boss: bossReport.suggestions_for_boss
    };

    console.log('Attempting to send email with params:', templateParams);
    emailjs.send('service_1tscokn', 'template_4310005', templateParams, '3zNb3Okj3StN3lJpk')
      .then((response) => {
         console.log('SUCCESS sending email via EmailJS!', response.status, response.text);
         toast.success('Anonymous feedback has been sent.');
         restartSession();
      }, (err) => {
         console.error('FAILED to send email via EmailJS. Error:', err);
         toast.error('Failed to send anonymous feedback. Please check console for details.');
         restartSession();
      });
  };

  const handleAvatarUpload = (imageUrl: string) => {
    setAvatarImage(imageUrl);
    toast.success('Avatar uploaded! Ready to start venting.');
  };

  const restartSession = () => {
    setCurrentStep('upload');
    setVentText('');
    setBossExpression('neutral');
    setAvatarImage(null);
    setBossEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Boss Vent
          </h1>
          <p className="text-lg text-gray-600">
          Express yourself safely, your voice matters
          </p>
          <p className="text-lg text-gray-600">
          Vent safely and send feedback anonymously to your boss
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {currentStep === 'upload' && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <Card className="p-8">
                  <h2 className="text-2xl font-semibold mb-4">Boss's Information</h2>
                  <p className="text-gray-600 mb-6">
                    Please provide your boss's email. Your feedback will be sent anonymously.
                    Upload a photo of your boss. This stays private and helps you visualize.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="bossEmail" className="block text-sm font-medium text-gray-700 mb-1">Boss's Email</label>
                      <Input
                        type="email"
                        id="bossEmail"
                        placeholder="boss@example.com"
                        value={bossEmail}
                        onChange={(e) => setBossEmail(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <AvatarUpload onUpload={handleAvatarUpload} />
                  </div>
                </Card>
              </div>
              
              <div className="text-center space-y-6 flex flex-col items-center">
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  {avatarImage ? (
                    <img src={avatarImage} alt="Boss Avatar" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <div className="text-4xl mb-2">👤</div>
                      <div>Avatar Preview</div>
                    </div>
                  )}
                </div>
                
                {avatarImage && (
                  <Button 
                    onClick={startVenting}
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    disabled={!bossEmail}
                  >
                    <Mic className="mr-2 h-5 w-5" />
                    Start Venting
                  </Button>
                )}
                {avatarImage && !bossEmail && (
                  <p className="text-sm text-gray-500 mt-2">Please enter the boss's email to start venting.</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 'venting' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Voice Input</h3>
                    <Button
                      onClick={stopVenting}
                      variant="destructive"
                      size="sm"
                    >
                      Stop Venting
                    </Button>
                  </div>
                  
                  <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-2 text-gray-500">
                       <Mic className="h-6 w-6" />
                       <span className="font-medium">{isRecording ? "Listening..." : "Stopped"}</span>
                    </div>
                  </div>

                  {ventText && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">What you're saying:</h4>
                      <p className="text-sm text-gray-700">{ventText}</p>
                    </div>
                  )}
                </Card>
              </div>
              
              <div className="flex items-center justify-center">
                <BossAvatar 
                  imageUrl={avatarImage} 
                  expression={bossExpression}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
