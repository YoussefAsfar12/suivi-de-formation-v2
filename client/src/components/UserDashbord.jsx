import { useEffect, useState } from 'react';
import {  getUserEnrolledFormations } from '../api/api';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from '@mui/material';
import { useAuth } from '../AuthContext/AuthProvider';
import { Link } from 'react-router-dom';


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
const UserDashboard = () => {
  const [userEnrolledFormations, setUserEnrolledFormations] = useState([]);
  // const [certificatedFormations,setCertificatedFormations]= useState([])
  const {user} = useAuth();
  useEffect(() => {
    const fetchUserEnrolledFormations = async () => {
    const userEnrolledFormationsData = await getUserEnrolledFormations(user);
    setUserEnrolledFormations(userEnrolledFormationsData);
    };
    fetchUserEnrolledFormations();
  }, [user]);

  return (
    <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
        <TableCell>Titre</TableCell>
        <TableCell>Domaine</TableCell>
        <TableCell>Niveau</TableCell>
        <TableCell>date debut</TableCell>
        <TableCell>date fin</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Action</TableCell>

        </TableRow>
      </TableHead>
      <TableBody>
        {userEnrolledFormations?.map((formation) => (
          <TableRow key={formation.id}>
            <TableCell>{formation.titre}</TableCell>
            <TableCell>{formation.domaine}</TableCell>
            <TableCell>{formation.niveau}</TableCell>
            <TableCell>{new Date(formation.dateDebut).toLocaleString()}</TableCell>
        <TableCell>{new Date(formation.dateFin).toLocaleString()}</TableCell>

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
    <Typography variant="h5" gutterBottom>
    Certifications
    </Typography>
    <Table>
      <TableHead>
        <TableRow>
        <TableCell>Titre</TableCell>
        <TableCell>Domaine</TableCell>
        <TableCell>Niveau</TableCell>

        </TableRow>
      </TableHead>
      <TableBody>
        {user.certifications?.map((certificate,key) => (
          <TableRow key={key}>
            <TableCell>{certificate.titre}</TableCell>
            <TableCell>{certificate.domaine}</TableCell>
            <TableCell>{certificate.niveau}</TableCell>
   

          </TableRow>
        ))}
      </TableBody>
    </Table>
          
  </TableContainer>
  );
};

export default UserDashboard;
