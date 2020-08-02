import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';
import { logOutOutline } from 'ionicons/icons';
import { Auth, Hub } from 'aws-amplify';

const Page: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          setUser(data);
          setIsLoggedIn(true);
          console.log("User logged in: ", data);
          break;
        case "signOut":
          setUser('');
          setIsLoggedIn(false);
          console.log("User logged out: ", data);
          break;
        case "customOAuthState":
          setUser(data);
      }
    });
  }, []); //call Hub listen only on component mount & unmount


  const onSignOutClick = async () => {
    await Auth.signOut()
        .then(data => console.log(data))
        .catch(err => console.log(err));
  }

  const { name } = useParams<{ name: string; }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => onSignOutClick()}>
              <IonIcon size='large' icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name={name} />
      </IonContent>
    </IonPage>
  );
};

export default Page;
