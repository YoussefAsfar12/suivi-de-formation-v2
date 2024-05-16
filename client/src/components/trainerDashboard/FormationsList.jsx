import { useEffect, useState } from 'react';
import { getUserFormations } from '../../api/api';
import { useAuth } from '../../AuthContext/AuthProvider';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress } from '@mui/material';

const getStatus = (formation) => {
  const currentDate = new Date();
  const startDate = new Date(formation.dateDebut);
  const endDate = new Date(formation.dateFin);

  if (currentDate < startDate) {
    return 'À venir';
  } else if (currentDate >= startDate && currentDate <= endDate) {
    return 'En cours';
  } else {
    return 'Terminé';
  }
};

function FormationsList() {
  const [formateurFormations, setFormateurFormations] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchFormations = async () => {
      try {
        setLoading(true);
        const formationsData = await getUserFormations(user);
        setFormateurFormations(formationsData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFormations();
    
  }, [user]);
  console.log(loading)

  return (

    <>
    {loading && (
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
          backgroundColor: 'rgba(255, 255, 255, 0.5)', 
        }}
      >
        <CircularProgress color="inherit" />
      </div>
    )


    }
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
          <TableCell>Titre</TableCell>
          <TableCell>Domaine</TableCell>
          <TableCell>Niveau</TableCell>
        <TableCell>Status</TableCell>
          <TableCell>Action</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {formateurFormations?.map((formation) => (
            <TableRow key={formation.id}>
              <TableCell>{formation.titre}</TableCell>
              <TableCell>{formation.domaine}</TableCell>
              <TableCell>{formation.niveau}</TableCell>
            <TableCell>{getStatus(formation)}</TableCell>

              <TableCell>
                <Button
                  component={Link}
                  to={`/training/${formation.id}`}
                  variant="contained"
                  color="primary"
                >
                  Détails
                </Button>
             
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}

export default FormationsList;