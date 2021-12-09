import axios from 'axios';
import AWS from 'aws-sdk';
import React, { useState, useEffect } from 'react';
import ReviewUploadModal from '../components/OrderCart/ReviewUploadModal';
import UserMealBox from '../components/OrderCart/UserMealBox';
import Loading from '../components/Loading';
import EmptyOrderAni from '../components/StoreInfo/EmptyOrderAni';
import '../styles/pages/UserMeal.css';

function UserMeal({ navigate }) {
  const accessToken = localStorage.getItem('accessToken');
  const [isLoading, setIsLoading] = useState(true);
  const [orderedMeal, setOrderedMeal] = useState([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const openReviewModalHandler = () => {
    setReviewModalOpen(!reviewModalOpen);
  };

  AWS.config.update({
    region: 'ap-northeast-2',
    accessKeyId: `${process.env.REACT_APP_SDK_ACCESSKEY_ID}`,
    secretAccessKey: `${process.env.REACT_APP_SDK_SECRETACCESS_KEY}`,
  });

  // const upload = new AWS.S3.ManagedUpload({
  //   params: {
  //     Bucket: 'meal2sdk',
  //     Key: imageFile,
  //     Body: imageFile,
  //   },
  // });
  // const promise = upload.promise();
  // promise.then(
  //   function (data) {
  //     console.log(promise);
  //     console.log('프로미스 성공');

  //   },
  //   function (err) {
  //     console.log('프로미스 깨짐');
  //   }
  // );

  const getDetailUserMealHandler = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/user-meal`, {
        headers: { authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      .then(res => {
        setOrderedMeal([res.data.userMeal]);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  };
  useEffect(() => {
    setIsLoading(true);
    getDetailUserMealHandler();
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="usermeal-container">
          <div className="usermeal-order-food-info-container">
            <div className="usermeal-reservation-container">
              <div className="usermeal-title">예약 내역</div>
              <div className="usermeal-store-title-container">
                <img className="usermeal-category-icon" src={require('../img/찌개.png').default} alt="" />
                <div className="usermeal-store-title">{orderedMeal[0].menu.store.store_name}</div>
              </div>
              <img className="usermeal-store-image" src={orderedMeal[0].menu.store.store_image} alt="" />
              <div className="usermeal-address-container">
                <i className="fas fa-map-marker-alt" />
                <div className="usermeal-address-text">{orderedMeal[0].menu.store.store_address}</div>
              </div>
              <div className="usermeal-description-container">
                <i className="fas fa-utensils" />
                <div className="usermeal-description-text">{orderedMeal[0].menu.store.store_description}</div>
              </div>
            </div>
            <div className="usermeal-ordered-info-container">
              <div className="usermeal-ordered-container">
                <div className="usermeal-ordered-title">주문한 음식</div>
                <UserMealBox orderedMeal={orderedMeal} />
              </div>
              <div className="usermeal-userinfo-container">
                <div className="usermeal-userinfo-title">주문 유저 정보</div>
                <div className="usermeal-username">'기부악마'님</div>
                <div className="usermeal-user-email">hyeonsi95@naver.com</div>
                <div className="usermeal-user-phone-number">010-1234-5678</div>
              </div>
            </div>
          </div>
          <button className="usermeal-confirm-button" onClick={openReviewModalHandler}>
            잘 먹었습니다!
          </button>

          {reviewModalOpen ? (
            <ReviewUploadModal
              navigate={navigate}
              openReviewModalHandler={openReviewModalHandler}
              orderedMeal={orderedMeal}
              setOrderedMeal={setOrderedMeal}
            />
          ) : null}
        </div>
      )}
    </>
  );
}

export default UserMeal;
