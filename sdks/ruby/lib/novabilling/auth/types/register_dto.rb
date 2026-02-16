# frozen_string_literal: true

module Novabilling
  module Auth
    module Types
      class RegisterDto < Internal::Types::Model
        field :name, -> { String }, optional: false, nullable: false
        field :email, -> { String }, optional: false, nullable: false
        field :password, -> { String }, optional: false, nullable: false
        field :company_name, -> { String }, optional: false, nullable: false, api_name: "companyName"
      end
    end
  end
end
