import { UrlState } from "@/context";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./button";
import { Input } from "./input";
import Error from "../error";
import { Card } from "./card";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { QRCode } from "react-qrcode-logo";
import useFetch from "@/hooks/use-fetch";
import { BeatLoader } from "react-spinners";
import { createUrl } from "@/db/apiUrls";

const CreateLink = () => {
  const { user } = UrlState();
  const ref = useRef();
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [error, SetError] = useState();
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
    err,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, { ...fromValue, userId: user.id });

  useEffect(() => {
    if (err === null && data) {
      navigate(`/link/${data[0].id}`);
    }
  }, [err, data]);


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
        {err?.customUrl && <Error message={err.customUrl} />}
        <DialogFooter className="sm:justify-start">
          <Button
            disabled={loading}
            onClick={createNewLink}
            type="submit"
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
