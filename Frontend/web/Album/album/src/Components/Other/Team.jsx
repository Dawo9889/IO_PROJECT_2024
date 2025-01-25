import { Link } from "react-router-dom"
const Team = () => {
    const teamMembers = [
        {
          name: "Hubert Bojda",
          role: "Frontend Developer",
          description: "Specializes in creating intuitive user interfaces.",
          image: "https://via.placeholder.com/150",
          github: "https://github.com/xHub50N",
          linkedin: "https://www.linkedin.com/in/hubert-bojda/",
        },
        {
          name: "Dawid Gala",
          role: "Backend Developer",
          description: "Passionate about building scalable APIs.",
          image: "https://via.placeholder.com/150",
          github: "https://github.com/Dawo9889",
          linkedin: "https://www.linkedin.com/in/galadawid/",
        },
        {
          name: "Szymon Antonik",
          role: "UI/UX Designer",
          description: "Designing beautiful, user-centered experiences.",
          image: "https://via.placeholder.com/150",
          github: "https://github.com/szantonik",
        },
        {
          name: "Jakub Stachurski",
          role: "DevOps Engineer",
          description: "Ensures seamless CI/CD pipelines and infrastructure.",
          image: "https://via.placeholder.com/150",
          github: "https://github.com/ViegoValentine",
        },
      ];
      
    return (
<div className="h-screen bg-project-dark">
  <h1 className="text-3xl font-bold text-center mb-8 text-white">Meet the Team</h1>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6">
    {teamMembers.map((member, index) => (
      <section
        key={index}
        className="text-center bg-project-dark-bg rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
      >
        {/* <img
          src={member.image}
          alt={member.name}
          className="w-full h-40 object-cover"
        /> */}
        <div className="p-4">
          <h2 className="text-2xl font-bold text-white">{member.name}</h2>
        </div>
        <div className="p-4 border-t border-project-pink flex items-center justify-center">
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-project-blue hover:underline m-2"
          >
            GitHub
          </a>
          {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-project-blue hover:underline m-2"
          >
            LinkedIn
          </a>
          )}
        </div>
      </section>
    ))}
  </div>
</div>

    )
}

export default Team