# frozen_string_literal: true

module Novabilling
  module Types
    class SubscriptionCustomerResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :name, -> { String }, optional: false, nullable: false
      field :email, -> { String }, optional: false, nullable: false
    end
  end
end
