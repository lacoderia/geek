class Message < ActiveRecord::Base
	belongs_to :tutor
	belongs_to :student

	def self.get_conversations condition, value
		query = "select * from messages where id in (select id from (select max(id) as id, student_id, tutor_id from messages where #{condition} = #{value} group by student_id, tutor_id) as sub)"
    messages = Message.find_by_sql(query)
	end

	def self.get_conversation student_id, tutor_id
		messages = Message.where('student_id = ? and tutor_id = ?', student_id, tutor_id).order(created_at: :desc) 
	end

	def self.mark_read message_id
		msg = Message.find(message_id)
    Message.where("id <= #{msg.id} and tutor_id = #{msg.tutor_id} and student_id = #{msg.student_id} and from_student = #{msg.from_student}").update_all("read = true")
	end

	def self.get_pending_conversations condition, value
		from_student = (condition == 'tutor_id' ? true : false)
		query = "select * from messages where id in (select id from (select max(id) as id, student_id, tutor_id from messages where #{condition} = #{value} and read = false and from_student = #{from_student} group by student_id, tutor_id) as sub)"
		messages = Message.find_by_sql(query)
	end
end
