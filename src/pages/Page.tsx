import { IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';
import { logOutOutline, menu } from 'ionicons/icons';
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

  const toggleMenu = () => {
    const splitPane = document.querySelector('ion-split-pane');
    const windowWidth = window.innerWidth;
    const splitPaneShownAt = 992;
    const when = `(min-width: ${splitPaneShownAt}px)`;
    if (windowWidth >= splitPaneShownAt) {
      // split pane view is visible
      const open = splitPane!.when === when;
      splitPane!.when = open ? false : when;
    } else {
      // split pane view is not visible
      // toggle menu open
      const menu = splitPane!.querySelector('ion-menu');
      return menu!.open();
    }
  }

  const { name } = useParams<{ name: string; }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => toggleMenu()}>
              <IonIcon icon={menu} size='large' slot="icon-only" />
            </IonButton>
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
