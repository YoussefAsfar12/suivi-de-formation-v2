import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Rating,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../AuthContext/AuthProvider";
import { addComment,  enrollFormation,  getFormation } from "../api/api";
import axios from "axios";

const TrainingDetailPage = () => {
  const { id } = useParams();
  const [formation, setFormation] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [rating, setRating] = useState(0);
  const { user,setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate= useNavigate();
  useEffect(() => {

    const fetchTrainingDetails = async () => {
      setLoading(true);
      try {
        const formationData = await getFormation(id);
        setFormation(formationData);
      } catch (error) {
        console.error("Error fetching training details", error);
      }finally{
        setLoading(false);
      }
    };

    fetchTrainingDetails();
  }, [id]);

  useEffect(() => {


    const fetchUserData = async () => {
      const checkUserEnroll = user?.formations_inscrites?.some(forma => forma.id === parseInt(id));
      setIsEnrolled(checkUserEnroll);
    };

    if (formation && user) {
      fetchUserData();
    }
    

  }, [formation, id, user, user?.formations_inscrites]);

  const handleEnroll = async (trainingId) => {
    if (!user) {
      return navigate("/login");
    }
    try {
      const res =  await axios.get(`http://localhost:8000/api/formations/${trainingId}/${user.id}/isEnrolled`,{
        withCredentials: true
      });
      if (!res.data.isEnrolled) {
        const updatedUser= await enrollFormation(user,trainingId);

        setUser(updatedUser);
        setIsEnrolled(true);
    

      }
    } catch (error) {
      console.error("Enrollment failed", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!user) {
      return navigate("/login");
    }
    if(comment==""){
      setCommentError("Veuillez entrer un commentaire");
      return;
    }
    try {
      await addComment(id,formation,user,comment,rating)
      const formationData= await getFormation(id);
      setFormation(formationData);
      setComment("");
      setCommentError("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting comment", error);
    }
  };

  return (
    <div>
      <h1>Détail de la formation</h1>
      {!loading && formation ? (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {formation.titre}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Disponibilité:{" "}
              {formation.disponible ? "Disponible" : "Non disponible"}
            </Typography>

        {formation.participants.length<formation.capacite_max && formation.formateur_id !== user?.id   &&
            <Button
            variant="contained"
            color="primary"
            onClick={() => handleEnroll(formation.id)}
            disabled={!formation.disponible  || isEnrolled}
            readOnly={!formation.disponible}
            style={{ marginTop: "16px", display:!formation.disponible}}
          >
            { 
            isEnrolled
              ? "Inscrit"
              :"S'inscrire" }
          </Button>
        }
            

            <Grid container spacing={2} style={{ marginTop: "16px" }}>
              <Grid item xs={12}>
                <Typography variant="h6">Commentaires</Typography>
              </Grid>
              {formation.evaluations?.map((evaluation, index) => (
                <Grid item xs={12} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2">
                        Commentaire de {evaluation.user.prenom+ " " +  evaluation.user.nom }:
                      </Typography>
                      <Typography>{evaluation.commentaire}</Typography>
                      <Rating value={evaluation.note} readOnly />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
              { commentError &&
                <Typography variant="subtitle2" sx={{mt:2}} color={"error"}>{commentError}</Typography>
              }
            <TextField
              label="Votre Commentaire"
              multiline
              rows={4}
              variant="outlined"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ marginTop: "16px" }}
            />

            <Rating
              name="rating"
              value={rating || 1}
              precision={0.5}
              onChange={(event, newValue) => setRating(newValue)}
              style={{ marginTop: "16px" }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleCommentSubmit}
              style={{ marginTop: "16px" }}
            >
              Soumettre le Commentaire
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent background
        }}
      >
        <CircularProgress color="inherit" />
      </div>
      )}
    </div>
  );
};

export default TrainingDetailPage;
