import React, { useState } from 'react';
import { View, StyleSheet, Modal, SafeAreaView, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { Header } from './components/Header';
import Progress from './components/Progress';
import { colors } from './res';

const BeautyWebView = ({
  visible,
  onPressClose,
  backgroundColor,
  headerContent, // 'dark' || 'light', default 'dark'
  headerBackground, // default #fff
  url, // Required
  customObject,
  customInjectedJS,
  onMessageData,
  progressColor,
  progressHeight,
  loadingText,
  copyLinkTitle,
  openBrowserTitle,
  extraMenuItems,
  animationType,
  progressBarType, // 'normal' || 'background'
  onLoadEnd,
  onLoadStart,
  navigationVisible,
  closeIcon,
  menuIcon,
  onGoBack,
  onGoForward
}) => {
  const [progressRef, setProgressRef] = useState(null);
  const [backgroundProgressRef, setBackgroundProgressRef] = useState(null);
  const [title, setTitle] = useState(loadingText);
  const [backQueue, setBackQueue] = useState([]);
  const [forwardQueue, setForwardQueue] = useState([]);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [injectedJS, setinjectedJS] = useState(customInjectedJS);
  const [customObjectState, setCustomObjectState] = useState(customObject);

  const onProgress = (progress) => {
    setCurrentUrl(url);
    progressRef?.startAnimation(progress);
    progressBarType === 'background' && backgroundProgressRef?.startAnimation(progress);
  };

  const onNavigationStateChange = (event) => {
    setinjectedJS(customInjectedJS)
    if (currentUrl === event.url) return;
    backQueue.push(currentUrl);
    setBackQueue(backQueue);
    onGoForward && onGoForward();
    setCurrentUrl(event.url);
  }

  const onPressBack = () => {
    if (backQueue.length == 0) return;
    const newUrl = backQueue[backQueue.length - 1];
    forwardQueue.push(currentUrl);
    setForwardQueue(forwardQueue);
    onGoBack && onGoBack();
    backQueue.pop();
    setBackQueue(backQueue);
    setCurrentUrl(newUrl);
  }

  const onPressForward = () => {
    if (forwardQueue.length == 0) return;
    const newUrl = forwardQueue[forwardQueue.length - 1];
    backQueue.push(currentUrl);
    setBackQueue(backQueue);
    forwardQueue.pop();
    setForwardQueue(forwardQueue);
    setCurrentUrl(newUrl);
    onGoForward && onGoForward();
  }

  const onClose = () => {
    onPressClose && onPressClose();
    setTimeout(() => {
      setBackQueue([]);
      setForwardQueue([]);
      setCurrentUrl(url);
    }, 200);
  } 

  return (
    <Modal style={{backgroundColor: 'black'}} visible={visible} transparent={false} animationType={animationType}>
      <SafeAreaView style={[styles.container, { backgroundColor: 'rgb(0, 0, 0)' }]}>
        <Header
          backgroundColor={headerBackground}
          contentType={headerContent}
          title={title}
          url={''}
          onPressClose={onClose}
          copyLinkTitle={copyLinkTitle}
          openBrowserTitle={openBrowserTitle}
          extraMenuItems={extraMenuItems}
          backgroundProgressRefOnChange={setBackgroundProgressRef}
          navigationVisible={navigationVisible}
          canForward={forwardQueue.length > 0}
          canback={backQueue.length > 0}
          onPressBack={onPressBack}
          onPressForward={onPressForward}
          closeIcon={closeIcon}
          menuIcon={menuIcon}
        />
        {/* {
          progressBarType === 'normal' &&
          <Progress
            height={progressHeight}
            color={progressColor}
            ref={(progress) => setProgressRef(progress)}
          />
        } */}
        {<WebView
          originWhitelist={['*']}
          source={
            url.os === 'android' ? {html: url.streamHTML, baseUrl: 'http://premiumoutletslive.com/api/liveStreamPost/create'} : 
            { uri: 'http://premiumoutletslive.com/api/liveStreamPost/create',
            headers: {"Content-Type": 'application/json'},
            body: `{
              "titleG": "${url.title}",
              "brandIdG": "${url.brandId}",
              "usernameG": "${url.userName}",
              "isGuestG": "${url.isGuest}"
            }`,
            method:'POST' }
          }
          onLoadProgress={({ nativeEvent }) => {
            let loadingProgress = nativeEvent.progress;
            onProgress(loadingProgress);
          }}
          // injectedJavaScript="window.ReactNativeWebView.postMessage(document.title)"
          injectedJavaScript={injectedJS}
          javaScriptEnabled={true}
          onMessage={onMessageData}
          onLoadEnd={onLoadEnd}
          onLoadStart={onLoadStart}
          allowFileAccess={true}
          onNavigationStateChange={onNavigationStateChange}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          allowsFullscreenVideo={true}
          startInLoadingState={true}
        />}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

BeautyWebView.defaultProps = {
  transparent: true,
  backgroundColor: colors.defaultBackground,
  headerContent: 'dark',
  headerBackground: colors.defaultBackground,
  progressColor: colors.progress,
  progressHeight: 4,
  loadingText: 'LiveStream',
  copyLinkTitle: 'Copy Link',
  openBrowserTitle: 'Open on Browser',
  animationType: "slide",
  progressBarType: "normal",
  navigationVisible: false
}

export default BeautyWebView;
