import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import makeStyles from "@mui/styles/makeStyles";

import { showNotification } from "baselayer/components/Notifications";
import { useForm } from "react-hook-form";

import * as ProfileActions from "../ducks/profile";

import UIPreferences from "./UIPreferences";
import NotificationPreferences from "./NotificationPreferences";
import SlackPreferences from "./SlackPreferences";
import ObservabilityPreferences from "./ObservabilityPreferences";
import FollowupRequestPreferences from "./FollowupRequestPreferences";
import PhotometryPlottingPreferences from "./PhotometryPlottingPreferences";
import ClassificationsShortcutForm from "./ClassificationsShortcutForm";

const useStyles = makeStyles(() => ({
  spacing: {
    paddingBottom: 0,
  },
}));

const UpdateProfileForm = () => {
  const classes = useStyles();
  const profile = useSelector((state) => state.profile);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const { handleSubmit, register, reset, errors } = useForm();

  const isNewUser =
    new URL(window.location).searchParams.get("newUser") === "true";

  const [welcomeDialogOpen, setWelcomeDialogOpen] = useState(isNewUser);

  useEffect(() => {
    reset({
      username: profile.username,
      firstName: profile.first_name,
      lastName: profile.last_name,
      email: profile.contact_email,
      phone: profile.contact_phone,
    });
  }, [reset, profile]);

  const onSubmit = async (initialValues) => {
    setIsSubmitting(true);
    const basicinfo = {
      username: initialValues.username,
      first_name: initialValues.firstName,
      last_name: initialValues.lastName,
      contact_email: initialValues.email,
      contact_phone: initialValues.phone,
    };
    const result = await dispatch(
      ProfileActions.updateBasicUserInfo(basicinfo)
    );
    if (result.status === "success") {
      dispatch(showNotification("Profile data saved"));
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <Typography variant="h5">Update User Profile</Typography>
      <Card>
        <CardContent>
          <h2>Username</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputLabel htmlFor="usernameInput">
              Username (normalized upon save)
            </InputLabel>
            <TextField
              inputRef={register({ required: true })}
              name="username"
              id="usernameInput"
              error={!!errors.username}
              helperText={errors.username ? "Required" : ""}
            />
            <h2>Contact Information</h2>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="baseline"
              spacing={2}
            >
              <Grid item xs={6} sm={3}>
                <InputLabel htmlFor="firstName_id">First Name</InputLabel>
                <TextField
                  inputRef={register({ required: true })}
                  name="firstName"
                  id="firstName_id"
                  error={!!errors.firstName}
                  helperText={errors.firstName ? "Required" : ""}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <InputLabel htmlFor="lastName_id">Last Name</InputLabel>
                <TextField
                  inputRef={register({ required: false })}
                  name="lastName"
                  id="lastName_id"
                />
              </Grid>
            </Grid>
            <br />
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="baseline"
              spacing={2}
            >
              <Grid item xs={12} sm={5}>
                <InputLabel htmlFor="email_id">
                  Preferred Contact Email
                </InputLabel>
                <TextField
                  inputRef={register({ pattern: /^\S+@\S+$/i })}
                  name="email"
                  type="email"
                  fullWidth
                  id="email_id"
                />
              </Grid>
            </Grid>
            <br />
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="baseline"
              spacing={2}
            >
              <Grid item xs={12} sm={3}>
                <InputLabel htmlFor="phone_id">
                  Contact Phone (Include Country Code)
                </InputLabel>
                <TextField
                  inputRef={register({ maxLength: 16 })}
                  name="phone"
                  type="tel"
                  id="phone_id"
                />
              </Grid>
            </Grid>
            <br />
            <Button
              variant="contained"
              type="submit"
              id="updateProfileButton"
              disabled={isSubmitting}
            >
              Update Profile
            </Button>
          </form>
        </CardContent>
        <CardContent>
          <NotificationPreferences />
        </CardContent>
        <CardContent>
          <SlackPreferences />
        </CardContent>
        <CardContent>
          <UIPreferences />
        </CardContent>
        <CardContent>
          <ObservabilityPreferences />
        </CardContent>
        <CardContent>
          <FollowupRequestPreferences />
        </CardContent>
        <CardContent className={classes.spacing}>
          <ClassificationsShortcutForm />
        </CardContent>
        <CardContent>
          <PhotometryPlottingPreferences />
        </CardContent>
      </Card>
      <Dialog
        open={welcomeDialogOpen}
        onClose={() => {
          setWelcomeDialogOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Welcome!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            First, please change your username as you see fit. You can also
            change your contact email address to something other than the one
            you used to authenticate. If you have a gravatar (
            <a href="https://en.gravatar.com/">https://en.gravatar.com/</a>)
            account set up for your contact email address then we&apos;ll use
            that gravatar picture throughout. Once you&apos;re done setting up
            your profile info, click Dashboard to get started.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setWelcomeDialogOpen(false);
            }}
          >
            Got it. Let&apos;s go!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UpdateProfileForm;
