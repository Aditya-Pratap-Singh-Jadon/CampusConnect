// import "./Meet_the_team.css";
// import { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { FaGithub, FaLinkedin } from "react-icons/fa";
// import adityaThumb from "./assets/Images/thumbnails/aditya.webp";
// import adityaFull from "./assets/Images/full/aditya.jpeg";

// import sithiThumb from "./assets/Images/thumbnails/sithi.webp";
// import sithiFull from "./assets/Images/full/sithi.jpeg";

// import sahilThumb from "./assets/Images/thumbnails/sahil.webp";
// import sahilFull from "./assets/Images/full/sahil.jpeg";

// const teamMembers = [
//   {
//     name: "Aditya Pratap Singh Jadon aka Adi",
//     bio: "For the love of Frontend.",
//     thumbnail: adityaThumb,
//     image: adityaFull,
//     github: "https://github.com/Aditya-Pratap-Singh-Jadon",
//     linkedin: "https://www.linkedin.com/in/aditya-pratap-singh-jadon-80559b321",
//   },
//   {
//     name: "Sithi Vignesh aka THUNDER",
//     bio: "It's never me, myself and I. it's always us, ourselves and we!",
//     thumbnail: sithiThumb,
//     image: sithiFull,
//     github: "https://github.com/Sithi-Vignesh",
//     linkedin: "https://linkedin.com/in/sithi-vignesh",
//   },
//   {
//     name: "Sahil Shah",
//     bio: "One line of code at a time.",
//     thumbnail: sahilThumb,
//     image: sahilFull,
//     github: "https://github.com/IGLTrevo0",
//     linkedin:
//       "https://www.linkedin.com/in/sahil-shah-0785a9339?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
//   },
//   {
//     name: "Monijeeta",
//     bio: ".",
//     image: "",
//     github: "https://github.com/",
//     linkedin: "https://linkedin.com/in/",
//   },
// ];

// function MeetTheTeam() {
//   const [expandedImage, setExpandedImage] = useState(null);

//   useEffect(() => {
//     if (!expandedImage) return;

//     const handleKeyDown = (e) => {
//       if (e.key === "Escape") setExpandedImage(null);
//     };

//     document.body.style.overflow = "hidden";
//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.body.style.overflow = "";
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [expandedImage]);

//   return (
//     <div className="team-page">
//       <div className="team-header">
//         <h1>
//           Meet The <span>Team</span>
//         </h1>
//         <p>
//           The builders behind CampusConnect. A platform created to help students
//           discover mentors, collaborators, and teammates across campus.
//         </p>
//       </div>

//       <div className="team-grid">
//         {teamMembers.map((member) => (
//           <div className="team-card" key={member.name}>
//             {member.thumbnail ? (
//               <img
//                 src={member.thumbnail}
//                 alt={member.name}
//                 width={130}
//                 height={130}
//                 loading="lazy"
//                 onClick={() => setSelectedImage(member.image)}
//               />
//             ) : (
//               <div className="team-avatar-placeholder">
//                 {member.name.charAt(0)}
//               </div>
//             )}

//             <h3>{member.name}</h3>
//             <p className="team-bio">{member.bio}</p>

//             <div className="team-links">
//               <a href={member.github} target="_blank" rel="noreferrer">
//                 <FaGithub />
//               </a>
//               <a href={member.linkedin} target="_blank" rel="noreferrer">
//                 <FaLinkedin />
//               </a>
//             </div>
//           </div>
//         ))}
//       </div>

//       {expandedImage &&
//         createPortal(
//           <div
//             className="profile-viewer-overlay"
//             onClick={() => setExpandedImage(null)}
//             role="dialog"
//             aria-modal="true"
//           >
//             <img
//               src={expandedImage}
//               alt="Profile"
//               className="profile-viewer-image"
//             />
//           </div>,
//           document.body,
//         )}
//     </div>
//   );
// }

// export default MeetTheTeam;

import "./Meet_the_team.css";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import adityaThumb from "./assets/Images/thumbnails/aditya.webp";
import adityaFull from "./assets/Images/FULL_PP/Aditya_full.jpeg";

import sithiThumb from "./assets/Images/thumbnails/vignesh.webp";
import sithiFull from "./assets/Images/FULL_PP/Vignesh_full.jpeg";

import sahilThumb from "./assets/Images/thumbnails/sahil.webp";
import sahilFull from "./assets/Images/FULL_PP/Sahil_full.jpeg";

const teamMembers = [
  {
    name: "Aditya Pratap Singh Jadon aka Adi",
    bio: "For the love of Frontend.",
    thumbnail: adityaThumb,
    image: adityaFull,
    github: "https://github.com/Aditya-Pratap-Singh-Jadon",
    linkedin: "https://www.linkedin.com/in/aditya-pratap-singh-jadon-80559b321",
  },
  {
    name: "Sithi Vignesh aka THUNDER",
    bio: "It's never me, myself and I. It's always us, ourselves and we!",
    thumbnail: sithiThumb,
    image: sithiFull,
    github: "https://github.com/Sithi-Vignesh",
    linkedin: "https://linkedin.com/in/sithi-vignesh",
  },
  {
    name: "Sahil Shah",
    bio: "One line of code at a time.",
    thumbnail: sahilThumb,
    image: sahilFull,
    github: "https://github.com/IGLTrevo0",
    linkedin:
      "https://www.linkedin.com/in/sahil-shah-0785a9339?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
  {
    name: "Monijeeta",
    bio: ".",
    thumbnail: "",
    image: "",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/in/",
  },
];

function MeetTheTeam() {
  const [expandedMember, setExpandedMember] = useState(null);

  useEffect(() => {
    if (!expandedMember) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setExpandedMember(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [expandedMember]);

  return (
    <div className="team-page">
      <div className="team-header">
        <h1>
          Meet The <span>Team</span>
        </h1>

        <p>
          The builders behind CampusConnect. A platform created to help students
          discover mentors, collaborators, and teammates across campus.
        </p>
      </div>

      <div className="team-grid">
        {teamMembers.map((member) => (
          <div className="team-card" key={member.name}>
            {member.thumbnail ? (
              <img
                className="team-avatar"
                src={member.thumbnail}
                alt={member.name}
                width={130}
                height={130}
                loading="lazy"
                onClick={() => setExpandedMember(member)}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <div className="team-avatar-placeholder">
                {member.name.charAt(0)}
              </div>
            )}

            <h2>{member.name}</h2>

            <p className="team-bio">{member.bio}</p>

            <div className="team-links">
              <a href={member.github} target="_blank" rel="noreferrer" aria-label={`${member.name}'s GitHub`}>
                <FaGithub />
              </a>

              <a href={member.linkedin} target="_blank" rel="noreferrer" aria-label={`${member.name}'s LinkedIn`}>
                <FaLinkedin />
              </a>
            </div>
          </div>
        ))}
      </div>

      {expandedMember &&
        createPortal(
          <div
            className="profile-viewer-overlay"
            onClick={() => setExpandedMember(null)}
            role="dialog"
            aria-modal="true"
          >
            <img
              src={expandedMember.image}
              alt={expandedMember.name}
              className="profile-viewer-image"
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}

export default MeetTheTeam;
