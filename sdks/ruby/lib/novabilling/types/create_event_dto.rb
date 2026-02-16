# frozen_string_literal: true

module Novabilling
  module Types
    class CreateEventDto < Internal::Types::Model
      field :transaction_id, -> { String }, optional: false, nullable: false, api_name: "transactionId"
      field :subscription_id, -> { String }, optional: false, nullable: false, api_name: "subscriptionId"
      field :code, -> { String }, optional: false, nullable: false
      field :timestamp, -> { String }, optional: true, nullable: false
      field :properties, -> { Internal::Types::Hash[String, Object] }, optional: true, nullable: false
    end
  end
end
