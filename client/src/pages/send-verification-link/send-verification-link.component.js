import { useAxios} from "../../contexts/fetch.context"
import React, { useState } from "react";
import CustomButton from "../../components/custom-button/custom-button.component";

const SendVerificationLink = ({ email }) => {
  const [sent, setSent] = useState(false);
  const { authAxios } = useAxios();



  const resendVerifyLink = async () => {
    setSent(!sent);
    const res = await authAxios.post("/users/resend/verification-link", {
      email,
    });
    console.log(res)
    setTimeout(() => setSent(!sent), 600000);
  };
  return (
    <div className="d-flex justify-content-center">
      <div className="d-flex flex-column" style={{width: 500}}>
        <h3 className="text-center mt-5 mb-4">Verify your email address</h3>
        {email ? (
          <>
            <p className="mb-4">
              The verification link has been sent to&nbsp;
              <span className="font-weight-bold">{email}</span>. Please confirm
              it is your e-mail address by clicking on the link specified in the
              email. The link is valid within 10 minutes after receiving it. You can resend the link after 10 minutes by clicking below.
            </p>
            {!sent ? (
              <CustomButton style={{width: 100, margin: "auto"}} type="submit" onClick={resendVerifyLink}>
                Resend
              </CustomButton>
            ) : (
              <CustomButton>Sent</CustomButton>
            )}
          </>
        ) : (
          <p>Email has not been supplied :(</p>
        )}
      </div>
    </div>
  );
};

export default SendVerificationLink;
