import DisplayToDo from './component/DisplayToDo';
import  ToDos   from './component/ToDos';
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import './css/main.css';

function App() {
  return (
    <div className="App">
       <div className="animation">
              <TypeAnimation
                sequence={[
                  "Add your To Do Reminder ⏰",
                  1250,
                  "Keep it Simple 😎",
                  1250,
                ]}
                speed={30}
                style={{ fontWeight: "bold" }}
                repeat={Infinity}
              />
          </div>
      <motion.div initial={{y:1000}} animate={{y:0}} transition={{type: "spring" ,duration:3}}>
      <ToDos />
      <DisplayToDo />
      </motion.div>
    </div>
  );
}

export default App;
