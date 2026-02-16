# frozen_string_literal: true

module Novabilling
  module Portal
    module Types
      class GetSubscriptionsPortalRequest < Internal::Types::Model
        field :external_id, -> { String }, optional: false, nullable: false, api_name: "externalId"
      end
    end
  end
end
