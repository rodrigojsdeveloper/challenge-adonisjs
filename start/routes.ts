import router from "@adonisjs/core/services/router";
import { validateXId } from "../app/middleware/validateXIdMiddleware.js";

import { StudentController } from "../app/controllers/studentController.js";
import { TeacherController } from "../app/controllers/teacherController.js";
import { ClassroomController } from "../app/controllers/classroomController.js";

const studentController = new StudentController();
const teacherController = new TeacherController();
const classroomController = new ClassroomController();

router.post("/students", (ctx) => studentController.create(ctx));
router.put("/students/:id", (ctx) => studentController.update(ctx));
router.delete("/students/:id", (ctx) => studentController.delete(ctx));
router.get("/students/:id", (ctx) => studentController.findById(ctx));
router.get("/students/:studentId/classrooms", (ctx) => studentController.getClassrooms(ctx));

router.post("/teachers", (ctx) => teacherController.create(ctx));
router.put("/teachers/:id", (ctx) => teacherController.update(ctx));
router.delete("/teachers/:id", (ctx) => teacherController.delete(ctx));
router.get("/teachers/:id", (ctx) => teacherController.findById(ctx));

router.post("/classrooms", (ctx) => classroomController.create(ctx)).use(validateXId);
router.put("/classrooms/:id", (ctx) => classroomController.update(ctx)).use(validateXId);
router.delete("/classrooms/:id", (ctx) => classroomController.delete(ctx)).use(validateXId);
router.get("/classrooms/:id", (ctx) => classroomController.findById(ctx));
router
  .post("/classrooms/:classroomId/students/:studentId", (ctx) =>
    classroomController.addStudent(ctx)
  )
  .use(validateXId);
router
  .delete("/classrooms/:classroomId/students/:studentId", (ctx) =>
    classroomController.deleteStudent(ctx)
  )
  .use(validateXId);
router
  .get("/classrooms/:classroomId/students", (ctx) => classroomController.getStudents(ctx))
  .use(validateXId);
