import style from './chat-onboarding-start.module.scss';
import { ReactComponent as OnboardingImage } from '../../../../assets/ember.svg';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, Loader, Button, InputToolbox } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { useRef, useState } from 'react';
import BottomBarBalance from '../../../../components/shared/BottomBarBalance/BottomBar';
import BottomBarButton from '../../../../components/shared/BottomBarButton/BottomBar';

function ChatOnboardingStart() {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef();
  const [messages, setMessages]: [any, any] = useState([
    {
      message: 'Hi, I’m Ember. Click me to create a new wallet and get started.',
      sender: 'Ember',
      direction: 'incoming',
      position: 'single',
    },
    {
      message: 'I’ll be your personal AI copilot to guide and assist you through the world of DeFi.',
      sender: 'Ember',
      direction: 'incoming',
      position: 'single',
    },
    {
      message: 'Let’s get started! </br> </br> <b>What’s your name?</b>',
      sender: 'Ember',
      direction: 'incoming',
      position: 'single',
    },
  ]);

  const EmberResponses = [
    [
      {
        message:
          '<b>Great. Now please provide your email address or phone number.</b> </br> </br>This will help recover your wallet if you lose access.',
        sender: 'Ember',
        direction: 'incoming',
        position: 'single',
      },
    ],
    [
      {
        message: 'Please enter the 6-digit code that you received in your email.',
        sender: 'Ember',
        direction: 'incoming',
        position: 'single',
      },
    ],
    [
      {
        message:
          'Your email has been successfully verified. Just one more step and you’ll have your very own secure self-custody crypto wallet! </br> </br>We’ll register this device as a 2FA hardware wallet using a passkey.',
        sender: 'Ember',
        direction: 'incoming',
        position: 'single',
      },
    ],
    [
      {
        message: 'Congratulations, your new wallet has been created and registered to this device!',
        sender: 'Ember',
        direction: 'incoming',
        position: 'single',
      },
      {
        message: 'Would you like to protect your wallet by setting up recovery? All I’ll need is your phone number.',
        sender: 'Ember',
        direction: 'incoming',
        position: 'single',
      },
    ],
    [
      {
        message: ' Great! </br> </br><b>What’s your phone number?</b>',
        sender: 'Ember',
        direction: 'incoming',
        position: 'single',
      },
    ],
    [
      {
        message: 'Now please enter the 6-digit code sent to your phone number.',
        sender: 'Ember',
        direction: 'incoming',
        position: 'single',
      },
    ],
    [
      {
        message: 'Your phone number has been successfully verified and recovery is now activated. </br> </br>Now you can sleep with peace of mind!',
        sender: 'Ember',
        direction: 'incoming',
        position: 'single',
      },
      {
        message:
          'You can open your new wallet here at the bottom of the screen.</br> </br> I’ll always be here to give you a hand with whatever you may need.',
        sender: 'Ember',
        direction: 'incoming',
        position: 'single',
      },
    ],
  ];

  const fetchResponse = (message: any) => {
    console.log(message);
    setTimeout(() => {
      setMessages((prevState: any) => [...prevState, ...EmberResponses[step]]);
      setIsLoading((prevState: any) => !prevState);
      setStep((prevState: any) => prevState + 1);
    }, 2000);
  };

  const handleSend = (message: any) => {
    setIsLoading(true);
    setMessages([
      ...messages,
      {
        message,
        direction: 'outgoing',
      },
    ]);

    fetchResponse(message);

    //@ts-ignore
    inputRef.current.focus();

    return;
  };

  return (
    <>
      <main className={style.onboardingStart}>
        <OnboardingImage />
        <h1>Ember</h1>

        {isLoading && <Loader />}
        <div style={{ position: 'relative', height: '80%' }}>
          <MainContainer className={`${style.transparent} ${style.container}`}>
            <ChatContainer className={style.transparent}>
              <MessageList className={style.transparent}>
                {messages.map((m: any, i: any) => (
                  <Message key={i} model={m} className={style.glass} />
                ))}
              </MessageList>

              <InputToolbox className={style.container}>
                <div className={style.carousel}>
                  <Button border color='white' className={style.button}>
                    Re-send code
                  </Button>
                  <Button border color='white' className={style.button}>
                    I never received a code
                  </Button>
                  <Button border color='white' className={style.button}>
                    I never received a code
                  </Button>
                  <Button border color='white' className={style.button}>
                    I never received a code
                  </Button>
                </div>
                {2 === step && <BottomBarButton></BottomBarButton>}
                {3 <= step && <BottomBarBalance></BottomBarBalance>}
              </InputToolbox>
              {/* @ts-ignore */}
              <MessageInput placeholder='Type message here' onSend={handleSend} ref={inputRef} attachButton={false} />
            </ChatContainer>
          </MainContainer>
        </div>
      </main>
    </>
  );
}

export default ChatOnboardingStart;
