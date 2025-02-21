import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./input";
import { Card } from "./card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Error from "../error";
import * as yup from "yup";
import useFetch from "@/hooks/use-fetch";
import { UrlState } from "@/context";
import { BeatLoader } from "react-spinners";
import { createUrl } from "@/db/apiUrls";
import { QRCode } from "react-qrcode-logo";

const CreateLink = () => {
  const { user } = UrlState();
  const ref = useRef();
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [error, SetError] = useState({});
  const [fromValue, setFromValue] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid Url")
      .required("Long Url is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFromValue({ ...fromValue, [e.target.id]: e.target.value });
  };

  const {
    loading,
    errors,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, { ...fromValue, user_id: user.id });

  useEffect(() => {
    if (!errors && data && data[0]?.id) {
      navigate(`/link/${data[0].id}`);
    }
  }, [errors, data, navigate]);


  const createNewLink = async () => {
    SetError([]);
    try {
      await schema.validate(fromValue, { abortEarly: false });
      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));
      await fnCreateUrl(blob);
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      SetError(newErrors);
    }
  };

  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">Create New Links</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
          <DialogDescription>
            create a new short link for your long url
          </DialogDescription>
        </DialogHeader>

        {fromValue?.longUrl && (
          <QRCode value={fromValue?.longUrl} size={250} ref={ref} />
        )}

        <Input
          id="title"
          placeholder="Short Link's Title"
          value={fromValue.title}
          onChange={handleChange}
        />
        {error?.title && <Error message={error.title} />}
        <Input
          id="longUrl"
          placeholder="Enter Your Long Url"
          value={fromValue.longUrl}
          onChange={handleChange}
        />
        {error?.longUrl && <Error message={error.longUrl} />}
        <div className="flex item-center gap-2">
          <Card className="p-2">Shortened.in</Card>/
          <Input
            id="customUrl"
            placeholder="Custom Link (optional)"
            value={fromValue.customUrl}
            onChange={handleChange}
          />
        </div>
        {errors?.customUrl && <Error message={errors.customUrl} />}
        <DialogFooter className="sm:justify-start">
          <Button
            disabled={loading}
            onClick={createNewLink}
            type="button"
            variant="destructive"
          >
            {loading ? <BeatLoader size={10} color="white" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
