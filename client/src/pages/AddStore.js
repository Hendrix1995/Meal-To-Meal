import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import axios from 'axios';
import AddMenu from '../components/Management/AddMenu';
import AddedMenu from '../components/Management/AddedMenu';

import '../styles/pages/AddStore.css';

function AddStore({ navigate, openWarningAlertHandler, setAlertMessage }) {
  const [address, setAddress] = useState('우편번호');
  const [addressDetail, setAddressDetail] = useState('주소');
  const [fullAddress, setFullAddress] = useState('');
  const [location, setLocation] = useState({ lat: null, lng: null });

  const [store, setStore] = useState();
  // 이 store는 내가 등록할 모든 가게의 정보가 다 담겨 있스
  const [menuList, setMenuList] = useState([]);
  const [menuInfo, setMenuInfo] = useState({ menu_name: '', menu_price: '' });

  const [isOpenSearchAddress, setIsOpenSearchAddress] = useState(false);

  const searchAddressHandler = () => {
    setIsOpenSearchAddress(!isOpenSearchAddress);
  };

  const onHandleChange = e => {
    setFullAddress(`${addressDetail} ${e.target.value}`);
  };

  const handleInputValue = key => e => {
    setMenuInfo({ ...menuInfo, [key]: e.target.value.toLowerCase() });
  };

  const addMenuHandler = () => {
    setMenuList([...menuList, { menu_name: menuInfo.menu_name, menu_price: menuInfo.menu_price }]);
  };

  const getLocationHandler = () => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${fullAddress}&language=ko&key=${process.env.REACT_APP_GEOCODING_KEY}`,
        { withCredentials: false }
      )
      .then(res => {
        setLocation({ lat: res.data.results[0].geometry.location.lat, lng: res.data.results[0].geometry.location.lng });
      })
      .catch(err => {
        setAlertMessage('주소를 검색 한 후에 저장해 주세요!');
        openWarningAlertHandler();
      });
  };

  const onCompletePost = data => {
    let fullAddr = data.address;
    let extraAddr = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddr += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddr += extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddr += extraAddr !== '' ? ` (${extraAddr})` : '';
    }

    setAddress(data.zonecode);
    setAddressDetail(fullAddr);
    setIsOpenSearchAddress(false);
  };

  return (
    <>
      <div className="AddStore-container">
        <div className="AddStore-store-title-container">
          <div className="AddStore-title">가게 정보 등록</div>
          <img className="AddStore-store-img" src={require('../img/dummy/store1.png').default} alt="" />
          <input type="file" className="AddStore-store-img-add-input" />
          <div className="AddStore-store-text">상호명</div>
          <input className="AddStore-store-info-input" placeholder="가게 이름을 입력하세요." />
          <div className="AddStore-store-text">카테고리</div>
          <input className="AddStore-store-info-input" placeholder="카테고리를 선택하세요." />
          <div className="AddStore-store-text">가게 설명</div>
          <textarea className="AddStore-store-description-input" placeholder="가게 설명을 입력하세요." />
        </div>
        <div className="AddStore-store-title-container">
          <div className="AddStore-store-text">영업시간</div>
          <input className="AddStore-store-info-input" placeholder="영업시간을 입력하세요." />
          <div className="AddStore-store-text">가게주소</div>
          <button className="AddStore-address-button" onClick={() => searchAddressHandler()}>
            가게 주소 등록하기
          </button>
          {isOpenSearchAddress ? (
            <div className="daum-postcode-backdrop">
              <div className="daum-postcode-window">
                <DaumPostcode autoClose onComplete={onCompletePost} />
              </div>
              <button className="daum-postcode-close" onClick={searchAddressHandler}>
                닫기
              </button>
            </div>
          ) : null}
          <div className="AddStore-store-address">{address}</div>
          <div className="AddStore-store-address">{addressDetail}</div>
          <input className="AddStore-store-info-input" placeholder="상세주소" onChange={e => onHandleChange(e)} />
          <div className="AddStore-title">메뉴 등록</div>
          {menuList.length !== 0
            ? menuList.map(item => (
                <div className="AddStore-add-menu-container">
                  <AddedMenu item={item} />
                </div>
              ))
            : null}
          <div className="AddStore-add-menu-container">
            <AddMenu handleInputValue={handleInputValue} menuInfo={menuInfo} />
          </div>
          <button className="AddStore-add-menu-button" onClick={() => addMenuHandler()}>
            + 저장 후 다음 메뉴 추가
          </button>
          <div className="AddStore-add-menu-button-container">
            <button className="AddStore-button" onClick={() => getLocationHandler()}>
              저장
            </button>
            <button className="AddStore-button">취소</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddStore;
