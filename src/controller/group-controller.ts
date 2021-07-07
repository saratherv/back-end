import { NextFunction, Request, Response } from "express"
import { Group } from "../entity/group.entity"
import { GroupStudent } from "../entity/group-student.entity"
import { Student } from "../entity/student.entity"
import { StudentRollState } from "../entity/student-roll-state.entity"
import { getRepository } from "typeorm"
import { CreateGroupInput, UpdateGroupInput } from "../interface/group.interface"



export class GroupController {

  private groupRepository = getRepository(Group)
  private groupStudentRepository = getRepository(GroupStudent)
  private studentRollStateRepository = getRepository(StudentRollState)
  private studentRepository = getRepository(Student)

  async allGroups(request: Request, response: Response, next: NextFunction) {
    return this.groupRepository.find()
  }

  async createGroup(request: Request, response: Response, next: NextFunction) {
    const { body: params } = request

    const CreateGroupInput: CreateGroupInput = {
      name : params.name,
      number_of_weeks : params.number_of_weeks,
      roll_states : params.roll_states,
      incidents : params.incidents,
      ltmt : params.ltmt,
      run_at : params.run_at,
      student_count : params.student_count,
    }

    const group = new Group()

    group.prepareToCreate(CreateGroupInput)

    return this.groupRepository.save(group)
  }

  async updateGroup(request: Request, response: Response, next: NextFunction) {
    const { body: params } = request

    this.groupRepository.findOne(params.id).then((group) => {
      const UpdateGroupInput: UpdateGroupInput =  {
        id: params.id,
        name: params.name,
        number_of_weeks: params.number_of_weeks,
        roll_states: params.roll_states,
        incidents: params.incidents,
        ltmt: params.ltmt,
        run_at: params.run_at,
        student_count: params.student_count,
        
      }
      group.prepareToUpdate(UpdateGroupInput)

      return this.groupRepository.save(group)
    })
  }

  async removeGroup(request: Request, response: Response, next: NextFunction) {
    let groupToRemove = await this.groupRepository.findOne(request.params.id)
    await this.groupRepository.remove(groupToRemove)
  }

  async getGroupStudents(request: Request, response: Response, next: NextFunction) {
    return this.groupStudentRepository.find({ group_id : request.params.group_id })
  }


  async runGroupFilters(request: Request, response: Response, next: NextFunction) {
    // Task 2:
  
    // 1. Clear out the groups (delete all the students from the groups)
    let studentGroupToRemove = await this.groupStudentRepository.find({group_id : request.params.group_id})
    await this.groupStudentRepository.remove(studentGroupToRemove)

    // 2. For each group, query the student rolls to see which students match the filter for the group
   
    // I will query all group here using this.groupRepository.find()
    // Query All students with their roll states using join query between student and student-roll table
    // Match if student and student roll data matches filter
    // add student to group.

    // 3. Add the list of students that match the filter to the group
  }
}
