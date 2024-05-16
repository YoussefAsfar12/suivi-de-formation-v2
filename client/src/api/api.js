// api.js
import axios from "axios";
// import { useAuth } from '../AuthContext/AuthProvider';
const API_BASE_URL = "http://localhost:8000/api";
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
export const getUserFormations = async (user) => {
  // console.log("getUserFormations");

  try {
    // const userData= await getUser(userId)
    // console.log(userData);

   

    if (user && user.role == "Formateur") {
      const response = await api.get(`/formateurs/${user.id}/formations`,{
        withCredentials: true
      });
      const allFormations = response.data.formations;
      return allFormations;
    }
    if (user && user.role == "Participant") {
      const response = await api.get(`/participants/${user.id}/formations`,{
        withCredentials: true
      });
      const allFormations = response.data.formations;
      return allFormations;
    }
  } catch (error) {
    console.error("Error fetching user formations", error);
    throw error;
  }
};

export const addUser = async (user) => {
  // console.log("getUser");

  try {
    await api.post("http://localhost:8000/api/users", user);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getUser = async (userId) => {
  // console.log("getUser");

  try {
    const response = await api.get(`/users/${userId}`);
    const userData = response.data.user;
    // console.log(userData)
    return userData;
  } catch (error) {
    console.error("Error fetching user ", error);
    throw error;
  }
};
export const login = async (data) => {
  // console.log("getUser");

    const response = await api.post(`/users/login`, {
      email: data.email,
      password: data.password
    });
    console.log(response.data)
    const userData = response.data.user;
    // console.log(userData)
    return userData;
  
};
export const logoutUser = async () => {
  // console.log("getUser");

     await api.get(`/users/logout`);

  
};
export const getCurrentUser = async () => {
  // console.log("getUser");

    const response = await api.get(`/users/current-user`);
   
    const userData = response.data.user;
    // console.log(userData)
    return userData;
  
};


export const getFormationParticipants = async (formationId) => {
  // console.log("getFormationParticipants");

  try {
    const resp = await api.get(
      `/formations/${formationId}/participants`
    )
    const formationParticipants = resp.data.participants;
    return formationParticipants;
  } catch (error) {
    console.error(error);
    throw error;
  }
};





export const AddFormation = async (formation,  user) => {
  try {
    // console.log(session);
    const response = await api.post(`/formations`, {
      dateFin: formation.dateFin,
      dateDebut: formation.dateDebut,
      titre: formation.titre,
      description: formation.description,
      niveau: formation.niveau,
      domaine: formation.domaine,
      lieu: formation.lieu,
      formateur: user.nom + " " + user.prenom,
      capacite_max: formation.capacite_max,
      disponible: formation.disponible,
      formateur_id: user.id
    });


    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const DeleteFormation = async (formationId) => {
  try {
    // Delete the formation
     await api.delete(`/formations/${formationId}`);

  } catch (error) {
    console.error(error);
    throw error;
  }
};



// export const getCertificatedFormations = async (user) => {
//   try {

//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };
export const getUserEnrolledFormations = async (user) => {
  try {
    const res= await api.get(`/participants/${user.id}/formations`);
    return res.data.formations;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addParticipant = async (user, formation) => {
  // console.log("getSessions");

  try {
    await api.put(`http://localhost:8000/api/formations/${formation.id}`, {
      ...formation,
      participants: [...formation.participants, { id: 101, nom: user.nom }]
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const enrollFormation = async (user, formationId) => {
  // console.log("getSessions");

  try {
    await api.post(`http://localhost:8000/api/formations/${formationId}/enroll/${user.id}`);
    const data =await getCurrentUser();
    console.log(data)
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const addcertification = async (user) => {
  // console.log("getSessions");

  try {
    const userFormations = await getUserEnrolledFormations(user);
    userFormations.map(async (formation) => {
      const currentDate = new Date();
      const endDate = new Date(formation.dateFin);

      if (currentDate >= endDate) {
        const checkIfExist = user?.certifications.some((certificate) => {
          return certificate.titre == formation.titre;
        });
        if(!checkIfExist){
          const resp = await api.put(`http://localhost:8000/users/${user.id}`, {
            ...user,
            certifications: [
              ...user.certifications,
              {
                titre: formation.titre,
                domaine: formation.domaine,
                niveau: formation.niveau
              }
            ]
          });

          return resp.data;
        }
        return;
        
      }
    });

    // const response=await api.put(`http://localhost:8000/users/${user.id}`, {
    //   ...user,
    //   certifications: [...user.certifications, {titre:formation.titre,domaine:formation.domaine,niveau:formation.niveau }],
    // });
    // const resp = await
    // const updatedUser= response.data;
    // return updatedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addComment = async (
  formationId,
  specificTraining,
  user,
  comment,
  rating
) => {
  // console.log("getSessions");

  try {
    await api.post(`http://localhost:8000/api/formations/${formationId}/comment`, {
          user_id: user.id,
          formation_id: formationId,
          role: user.role,
          username: user.nom,
          commentaire: comment,
          note: rating
        
      
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  // console.log("getSessions");

 
    const response = await api.get(
      `http://localhost:8000/api/users/by-email?email=${email}`);
    const user = response.data.user;
    
    return user;
  
};
export const getFormationByTitre = async (titre) => {
  console.log(titre);

  try {
    const response = await api.get(
      `http://localhost:8000/api/formations/by-titre?titre=${titre} `);
    const formation = response.data.formation;
    console.log(formation);
    // console.log(formation);
    return formation;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getUserByName = async (nom,prenom) => {
  // console.log("getSessions");
console.log(nom,prenom)
    const response = await api.get(
      `http://localhost:8000/api/users/by-name?nom=${nom}&prenom=${prenom} `);
    const user = response.data.user;
    return user;
 
};

export const getNotifications = async () => {
  // console.log("getSessions");

      const reponse = await api.get(`/notifications`);
    const notifications = reponse.data.notifications;
    return notifications;
  
  
};

export const getUsers = async () => {
  // console.log("getUsers");

  try {
    const response = await api.get(`/users`);
    const users = response.data;

    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getToken = async () => {
  // console.log("getUsers");

  try {
    const response = await api.get(`/get-token`);
    const users = response.data.token;

    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getFormations = async () => {
  // console.log("getFormations");

  try {
    const response = await api.get(`/formations`);

    const formations = response.data.formations;
    return formations;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const resetUnreadNotifications = async () => {
  // console.log("getFormations");

  const resp = await api.patch(`/notifications/reset-unread-notifications`,{});
  return resp;
};




export const updateFormation = async (formation) => {
  // console.log("getFormations");

  try {
    // console.log(forma[0].evaluations);
    await api.put(`http://localhost:8000/api/formations/${formation.id}`, {
      ...formation
    });
    // console.log()
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getFormation = async (formationId) => {
  try {
    const response = await api.get(
      `/formations/${formationId}`
    );
    const formation = response.data.formation;
    return formation;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
