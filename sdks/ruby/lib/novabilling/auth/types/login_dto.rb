# frozen_string_literal: true

module Novabilling
  module Auth
    module Types
      class LoginDto < Internal::Types::Model
        field :email, -> { String }, optional: false, nullable: false
        field :password, -> { String }, optional: false, nullable: false
      end
    end
  end
end
