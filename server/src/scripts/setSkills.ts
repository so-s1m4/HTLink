import { Skill } from "../modules/skills/skills.model"

class setSkills {
	static skills = ["Express Js", "Angular", "Python"]

	constructor(skills: string[] = []) {
		if (skills.length > 1) {
			setSkills.skills = skills
		}
	}

	static async isAlreadySet() {
		const skillsCount = await Skill.countDocuments()
		return skillsCount == this.skills.length
	}

	static async set() {
		if (await this.isAlreadySet()) {
			console.log("Skills already set")
			return
		}
		await Skill.bulkWrite(this.skills.map(skill => ({
			insertOne: {
				document: {
					name: skill
				}
			}
		})))
		console.log("Skills were set")
	}
}

export default setSkills