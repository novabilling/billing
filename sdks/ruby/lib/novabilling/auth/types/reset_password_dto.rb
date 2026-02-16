# frozen_string_literal: true

module Novabilling
  module Auth
    module Types
      class ResetPasswordDto < Internal::Types::Model
        field :token, -> { String }, optional: false, nullable: false
        field :new_password, -> { String }, optional: false, nullable: false, api_name: "newPassword"
      end
    end
  end
end
