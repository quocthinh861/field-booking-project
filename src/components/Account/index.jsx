import React from "react";
import "./style.css";
import teamLogo from "../../assets/images/barrier.png";
import footballPlayer from "../../assets/images/football-player.png";
import starIcon from "../../assets/images/icons/star.png";
import groupIcon from "../../assets/images/icons/group.png";
import flashIcon from "../../assets/images/icons/flash.png";
import crownIcon from "../../assets/images/icons/crown.png";
import CreateTeam from "../CreateTeam";
import { useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import supabase from "../../client/Supabase";
import { uploadImage, getImageUrl } from "../../utils/FileUtil";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function Account() {
  const axiosPrivate = useAxiosPrivate();
  const [content, setContent] = React.useState(null);
  const [teamList, setTeamList] = React.useState([]);
  const [thumbnailImage, setThumbnailImage] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [districy, setDistricy] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [birthDay, setBirthDay] = React.useState("");
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user.data?.user) {
      const userId = user.data.user.id;
      axiosPrivate
        .get(`/account/getUserInfo?userId=${userId}`)
        .then((res) => {
          // Handle the response here
          console.log("Response", res);
          if (res && res.status == 200) {
            const userInfo = res.data.result;
            console.log("userInfo", userInfo);
            setEmail(userInfo.email);
            setFullName(userInfo.fullName);
            setPhoneNumber(userInfo.phoneNumber);
            setAddress(userInfo.address);
            setHeight(userInfo.height);
            setWeight(userInfo.weight);
            setBirthDay(userInfo.birthday);
          }
        })
        .catch((error) => {
          // Handle errors here, e.g., logging or displaying an error message
          console.error("Error fetching user info:", error);
        });
    }
  }, [user]);

  useEffect(() => {
    axiosPrivate.get("/team/getTeamListByCaptainId?captainId=1").then((res) => {
      if (res.status == 200 && res.data.result) {
        setTeamList(res.data.result);
      }
    });
  }, []);

  const resetThumbnailImage = () => {
    setThumbnailImage("");
  };

  const handleUpdateAvatar = async (file, path = "") => {
    try {
      const thumbnailImageKey = await uploadImage(file, path);
      if (thumbnailImageKey == null) {
        alert("Lỗi upload ảnh, vui lòng thử lại!");
        return;
      } else {
        alert("Cập nhật ảnh đại diện thành công!");
      }
    } catch (error) {
      alert("Lỗi upload ảnh đại diện");
    }

    resetThumbnailImage();
  };

  const handleUpdateUserInfo = async () => {
    if (user.data?.user) {
      const userId = user.data.user.id;
      const data = {
        id: userId,
        email: email,
        fullName: fullName,
        phoneNumber: phoneNumber,
        address: address,
        height: height,
        weight: weight,
        birthday: birthDay,
      };

      axiosPrivate
        .post("/account/updateUserInfo", data)
        .then((res) => {
          if (res.status == 200) {
            toast.success("Cập nhật thông tin thành công!");
          }
        })
        .catch((error) => {
          toast.error("Cập nhật thông tin thất bại!");
        });
    }
  };

  return content !== null ? (
    content
  ) : (
    <div className="user-page-content">
      <section className="border-light">
        <div className="row justify-content-center m-2">
          <h5
            className="w-100 text-center d-none d-md-block"
            style={{ fontWeight: 700 }}
          >
            Thông tin tài khoản
          </h5>
        </div>
        <div className="row justify-content-center m-2">
          <div className="col-4">
            <div className="profile-picture">
              <label htmlFor="thumbnail-image">
                <div className="avatar">
                  <img
                    alt="avatar"
                    id="avatar"
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      textAlign: "center",
                    }}
                    src={user?.data.avatar || footballPlayer}
                  />
                </div>
              </label>
              <input
                type="file"
                id="thumbnail-image"
                name="thumbnail-image"
                accept="image/*"
                className="visually-hidden"
                onChange={(event) => {
                  const file = event.target.files[0];
                  const path = `${user?.data?.user.id}/avatar`;
                  handleUpdateAvatar(file, path);
                }}
              />
            </div>
            <p className="text-center mt-4">Ảnh đại diện</p>
            <div className="team-list">
              <div className="flex justify-between mb-2">
                <a>Câu lạc bộ</a>
                <small
                  className="cursor-pointer"
                  onClick={() => setContent(<CreateTeam></CreateTeam>)}
                >
                  Tạo CLB mới
                </small>
              </div>
              {teamList.map((team) => {
                return (
                  <div className="team-item bg-gray-100 mb-2">
                    <div className="team-item__logo">
                      <img src={teamLogo} />
                    </div>
                    <div className="team-item__info">
                      <img src={crownIcon} className="w-5 h-5 logo-owner" />
                      <div className="team-item__name">{team.name}</div>
                      <div className="team-item__description">
                        <span>
                          <img src={flashIcon} className="w-5 h-5" />
                          {team.skilllevel}
                          <p className="show-info">
                            <b>Điểm trình độ: </b>
                            Đây là điểm trình độ của bạn so với các đội khác.
                            Điểm càng cao thì trình độ càng tốt.
                          </p>
                        </span>
                        <span>
                          <img src={groupIcon} className="w-5 h-5" />
                          {team.size}
                          <p className="show-info">
                            <b>Số lượng: </b> {team.size} thành viên
                          </p>
                        </span>
                        <span>
                          <img src={starIcon} className="w-5 h-5" />
                          {team.rankingpoint}
                          <p className="show-info">
                            <b>Điểm uy tín: </b>
                            <ul>
                              <li>Điểm uy tín mặc định là 100.</li>
                              <li>
                                Đá và nhận xét thành công sẽ nhận được 1 điểm.
                              </li>
                              <li>Hủy kèo sát giờ chơi sẽ bị trừ 3 điểm.</li>
                            </ul>
                          </p>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col col-8">
            <div className="d-flex justify-content-center">
              <div className="w-75">
                <div className="form-row">
                  <div className="form-group col-md-6 mb-4">
                    <label htmlFor="user_email" className="form-label">
                      Email
                    </label>
                    <input
                      className="form-control"
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                      }}
                      name="user[email]"
                      id="user_email"
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="user_name" className="form-label">
                      Họ Tên
                    </label>
                    <input
                      className="form-control"
                      placeholder="Họ Tên"
                      type="text"
                      value={fullName}
                      onChange={(event) => {
                        setFullName(event.target.value);
                      }}
                      name="user[name]"
                      id="user_name"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="user_name" className="form-label">
                    Số điện thoại
                  </label>
                  <input
                    className="form-control mb-4"
                    placeholder="Số điện thoại"
                    type="telephone"
                    value={phoneNumber}
                    onChange={(event) => {
                      setPhoneNumber(event.target.value);
                    }}
                    name="phone"
                    id="user_phone"
                  />
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="user_address" className="form-label">
                    Địa chỉ
                  </label>
                  <input
                    className="form-control mb-4"
                    placeholder="Điạ chỉ"
                    type="address"
                    value={address}
                    onChange={(event) => {
                      setAddress(event.target.value);
                    }}
                    name="phone"
                    id="user_phone"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6 mb-4">
                    <label htmlFor="product-description" className="form-label">
                      Thành phố/Tỉnh
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      defaultChecked="Tp Hồ Chí Minh"
                    >
                      <option value="1">Tp Hồ Chí Minh</option>
                    </select>
                  </div>
                  <div className="form-group col-md-6 mb-4">
                    <label htmlFor="product-description" className="form-label">
                      Quận/Huyện
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      defaultChecked="Quận Gò Vấp"
                    >
                      <option value="1">Quận Gò Vấp</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6 mb-4">
                    <label htmlFor="user_email" className="form-label">
                      Chiều cao (cm)
                    </label>
                    <input
                      className="form-control"
                      placeholder="cm"
                      onChange={(event) => {
                        setHeight(event.target.value);
                      }}
                      type="text"
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="user_name" className="form-label">
                      Cân nặng (kg)
                    </label>
                    <input
                      className="form-control"
                      placeholder="kg"
                      type="text"
                      onChange={(event) => {
                        setWeight(event.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="form-group col-md-12 mb-4">
                  <label htmlFor="user_email" className="form-label">
                    Ngày sinh
                  </label>
                  <input
                    className="form-control"
                    placeholder="Ngày sinh"
                    type="date"
                    onChange={(event) => {
                      setBirthDay(event.target.value);
                    }}
                    name="user[date_of_birth]"
                    id="user_date_of_birth"
                  />
                </div>
                <button
                  name="button"
                  className="btn btn-green"
                  onClick={handleUpdateUserInfo}
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Account;
