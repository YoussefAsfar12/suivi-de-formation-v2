import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Paper,
  Grid,
  InputLabel,
  FormControl
} from "@mui/material";
import { useAuth } from "../../AuthContext/AuthProvider";
import {
  AddFormation,
  DeleteFormation,
  getFormationByTitre,
  getUserFormations,
  updateFormation
} from "../../api/api";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";

const schema = yup.object().shape({
  titre: yup.string().required("Title is required"),
  niveau: yup.string().required("Level is required"),
  description: yup.string().required("Description is required"),
  lieu: yup.string().required("lieu is required"),
  capacite_max:yup.number().required("required"),
  dateDebut: yup.date().required('Date Début is required'),
  dateFin: yup.date().required('Date Fin is required'),
});

const styles = {
  formContainer: {
    textAlign: "center",
    marginTop: 4
  },
  paper: {
    padding: 4,
    marginTop: 2,
    marginBottom: 2,
    border: "1px solid primary.main",
    borderRadius: 2
  },
  button: {
    marginTop: 2,
    marginLeft: 2
  }
};

const TrainerManagementPage = () => {
  const { user, updateUser } = useAuth();
  const [formations, setFormations] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedFormationId, setSelectedFormationId] = useState(null);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    const fetchFormateurFormations = async () => {
      try {
        const formateurFormations = await getUserFormations(user);
        setFormations(formateurFormations);
      } catch (error) {
        console.error("Error fetching formations", error);
      }
    };

    fetchFormateurFormations();
  }, [user]);

  const handleCreateFormation = async (data) => {
    try {
      const formationExist = await getFormationByTitre(data.titre);
      if (formationExist.length === 0) {
        const formattedOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
        const updatedFormation = {
          ...data,
          dateDebut: new Date(data.dateDebut).toLocaleString(undefined, formattedOptions),
          dateFin: new Date(data.dateFin).toLocaleString(undefined, formattedOptions),
          formateur: user.nom,
          participants: []
        };
        console.log(updatedFormation)
        await AddFormation(updatedFormation, updateUser, user);
        clearForm();
        const formations = await getUserFormations(user);
        setFormations(formations);
      } else {
        alert("formation already exist");
      }
    } catch (error) {
      console.error("Error creating formation", error);
    }
  };

  const handleDeleteFormation = async (formationId) => {
    try {
      await DeleteFormation(formationId, updateUser, user);
      const formations = await getUserFormations(user);
      setFormations(formations);
    } catch (error) {
      console.error("Error deleting formation", error);
    }
  };

  const handleUpdateFormation = async (data) => {
    try {
      const formattedOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
      await updateFormation(
        { ...data, id: selectedFormationId,
        dateDebut: new Date(data.dateDebut).toLocaleString(undefined, formattedOptions),
        dateFin: new Date(data.dateFin).toLocaleString(undefined, formattedOptions),
      });
      clearForm();
      const formations = await getUserFormations(user);
      setFormations(formations);
      setIsUpdateMode(false);
    } catch (error) {
      console.error("Error updating formation", error);
    }
  };

  const handleModifyFormation = (formation) => {
    setValue("titre", formation.titre);
    setValue("domaine", formation.domaine);
    setValue("niveau", formation.niveau);
    setValue("description", formation.description);
    setValue("lieu", formation.lieu);
    // setValue("dateDebut", new Date(formation.date_debut));
    // setValue("dateFin", new Date(formation.date_fin));
    setValue("participants",formation.participants)
    setValue("formateur",formation.formateur)
    setValue("disponible", formation.disponible);
    setValue("capacite_max", formation.capacite_max);
    setSelectedFormationId(formation.id);
    setIsUpdateMode(true);
  };

  const clearForm = () => {
    setValue("titre", "");
    setValue("domaine", "");
    setValue("niveau", "Débutant");
    setValue("description", "");
    setValue("disponible", false);
    setValue("capacite_max",0)
  };

  return (
    <Container sx={styles.formContainer}>
      <Typography variant="h4" gutterBottom>
        Formulaire de formation
      </Typography>

      <form
        onSubmit={handleSubmit(
          isUpdateMode ? handleUpdateFormation : handleCreateFormation
        )}
      >
        <Paper sx={styles.paper} elevation={3}>
          <Controller
            name="titre"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                value={field.value || ""}
                label="Titre"
                error={!!errors.titre}
                helperText={errors.titre?.message}
                sx={styles.marginBottom2}
              />
            )}
          />

          <Controller
            name="domaine"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Domaine"
                value={field.value || ""}
                margin="normal"
                error={!!errors.domaine}
                helperText={errors.domaine?.message}
                sx={styles.marginBottom2}
              />
            )}
          />

          <Controller
            name="niveau"
            control={control}
            defaultValue="Débutant"
            render={({ field }) => (
              <Select
                {...field}
                fullWidth
                label="Niveau"
                sx={styles.marginBottom2}
              >
                <MenuItem value="Débutant">Débutant</MenuItem>
                <MenuItem value="Intermédiaire">Intermédiaire</MenuItem>
                <MenuItem value="Avancé">Avancé</MenuItem>
              </Select>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                value={field.value || ""}
                label="Description"
                margin="normal"
                error={!!errors.description}
                helperText={errors.description?.message}
                sx={styles.marginBottom2}
              />
            )}
          />
          <Controller
            name="lieu"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                value={field.value || ""}
                label="Lieu"
                margin="normal"
                error={!!errors.lieu}
                helperText={errors.lieu?.message}
                sx={styles.marginBottom2}
              />
            )}
          />
          <Controller
            name="capacite_max"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                value={field.value || ""}
                label="Capacite Max"
                margin="normal"
                error={!!errors.capacite_max}
                helperText={errors.capacite_max?.message}
                sx={styles.marginBottom2}
              />
            )}
          />

          <InputLabel>Date Début</InputLabel>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <Controller
              name="dateDebut"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="datetime-local"
                  fullWidth
                  error={!!errors.dateDebut}
                  helperText={errors.dateDebut?.message}
                  InputProps={{}}
                />
              )}
            />
          </FormControl>

          <InputLabel>Date Fin</InputLabel>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <Controller
              name="dateFin"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="datetime-local"
                  fullWidth
                  error={!!errors.dateFin}
                  helperText={errors.dateFin?.message}
                  InputProps={{}}
                />
              )}
            />
          </FormControl>

          <Controller
            name="disponible"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <Select
                {...field}
                fullWidth
                label="Disponible"
                sx={styles.marginBottom2}
              >
                <MenuItem value={true}>Disponible</MenuItem>
                <MenuItem value={false}>Non disponible</MenuItem>
              </Select>
            )}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={styles.button}
          >
            {isUpdateMode
              ? "Mise à jour de la formation"
              : "Ajouter une formation"}
          </Button>
          {isUpdateMode && (
            <Button
              variant="contained"
              color="primary"
              sx={styles.button}
              onClick={() => setIsUpdateMode(false)}
            >
              Ajouter une formation
            </Button>
          )}
        </Paper>
      </form>

      <Grid container spacing={2} sx={styles.marginTop2}>
        {formations.map((formation) => (
          <Grid item xs={12} key={formation.id}>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
              <Typography variant="subtitle1">
                {formation.titre} - {formation.domaine} - {formation.niveau}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                sx={styles.marginTop2}
                onClick={() => handleDeleteFormation(formation.id)}
              >
                supprimer
              </Button>
              <Button
                variant="contained"
                color="info"
                sx={styles.button}
                onClick={() => handleModifyFormation(formation)}
              >
                modifier
              </Button>
              <Link
                to={`/${formation.id}/participants`}
                style={{ textDecoration: "none" }}
              >
                <Button variant="contained" color="warning" sx={styles.button}>
                  Participants
                </Button>
              </Link>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TrainerManagementPage;
